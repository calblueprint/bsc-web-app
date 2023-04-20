import { Dictionary, EntityId, EntityState } from "@reduxjs/toolkit";
import {Shift, User} from "../types/schema";
import dayjs, { Dayjs } from "dayjs";
import { HOURS_REQUIRED, NEUTRAL_PREFERENCE, LIKED_PREFERENCE, DISLIKED_PREFERENCE } from "@/utils/constants";

// TODO: DOESN'T WORK IF SOMEONE IS ALREADY ASSIGNED DURING THEIR AVAILABILITY PERIOD TO A DIFFERENT SHIFT

/**
 * Returns a list of user ids that are available to complete the shift
 *
 * @param shiftObject - The shift object
 * @param days - The days that we iterate through
 * @param entityState - the entity state from redux
 * @returns A list of user ids that are available to complete the shift
*/
const filterUsersByAvailability = (shiftObject: Shift, days: string[], entityState: EntityState<User>) => {
  const numHours = Math.floor(shiftObject.hours);
  const numMinutes = (shiftObject.hours - numHours) * 60;
  const shiftStart: Dayjs = dayjs(shiftObject.timeWindow.startTime, 'HHmm')
  const shiftEnd: Dayjs = dayjs(shiftObject.timeWindow.endTime, 'HHmm')
  const shiftID = shiftObject.shiftID;
  let totalUsersInHouse: EntityId[] = entityState.ids;
  let availableUserIDs: EntityId[] = [];
  let idToObjectDictionary: Dictionary<User> = entityState.entities;
  // iterate thru all users in the house
  for (let i = 0; i < totalUsersInHouse.length; i++) {
    const userID = totalUsersInHouse[i];
    const userObject = idToObjectDictionary[userID];
    if (userObject === undefined) {
        continue;
    }
    // if this user has already been assigned to this shift, display them regardless of hours
    if (userObject.assignedScheduledShifts !== undefined && userObject.assignedScheduledShifts.includes(shiftID)) {
        availableUserIDs.push(userID)
        continue;
    }
    const currAvailabilities: { [key: string]: { startTime: string; endTime: string }[] } = userObject.availabilities;
    if (currAvailabilities === undefined) {
        continue;
    }
    // flag to determine if user id has been added to the list of available user ids already so that we only add a user id to the list once
    let isAdded = false;
    // iterate thru all days for a user
    for (let j = 0; j < days.length; j++) {
        const day = days[j];
        if (!(day in currAvailabilities)) {
            continue;
        }
        const perDayAvailability = currAvailabilities[day];
        if (perDayAvailability === undefined) {
            continue;
        }
        // iterate thru all availabilities per day for a user
        // TODO: CHECK IF THEYRE ASSIGNED TO A DIFFERENT SHIFT DURING THE AVAILABILITY WINDOW
        for (let k = 0; k < perDayAvailability.length; k++) {
            const currInterval = perDayAvailability[k];
            // start of the user availability window
            let userStart: Dayjs = dayjs("" + currInterval.startTime, 'HHmm')
            // end of the user availability window
            let userEnd: Dayjs = dayjs("" + currInterval.endTime, 'HHmm')
            // if user's availability window ends before the start of the shift, can continue
            if (userEnd.isBefore(shiftStart) || userEnd.isSame(shiftStart)) {
                continue;
            }
            // calculatedStart = either the start of the shift or the start of the user's availability, whichever comes later
            let calculatedStart: Dayjs = shiftStart;
            if (userStart.isAfter(shiftStart)) {
                calculatedStart = userStart;
            }
            // add the number of hours required to complete to the calculatedStart
            const calculatedEnd = calculatedStart.add(numHours, 'hour').add(numMinutes, 'minute');
            // calculatedEndRequirement = either the end of the shift or the end of the user's availability, whichever comes earlier
            let calculatedEndRequirement: Dayjs = shiftEnd;
            if (userEnd.isBefore(shiftEnd)) {
                calculatedEndRequirement = userEnd;
            }
            // only add the user id if the calculated end of when they would finish the shift is before the end of the shift or the end of their availability, whichever comes first
            if (calculatedEnd.isBefore(calculatedEndRequirement) || calculatedEnd.isSame(calculatedEndRequirement)) {
                availableUserIDs.push(userID);
                isAdded = true;
                break;
            }
        }
        if (isAdded) {
            break;
        }
    }
  }
  return availableUserIDs;
}

/**
 * Returns a list of user ids that are eligible to complete the shift (hours unassigned >= credit hours/already assigned to the shift)
 *
 * @param ids - A list of user entity ids
 * @param entityState - the entity state from redux
 * @param creditHours - the credit hours for the shift
 * @param shiftID - the id of the shift
 * @returns A list of user ids that are eligible to complete the shift
*/
const filterUsersByEligibility = (ids: EntityId[], entityState: EntityState<User>, creditHours: number, shiftID: string) => {
    const eligibleIDs: EntityId[] = [];
    const idToObjectDictionary: Dictionary<User> = entityState.entities;
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const userObject = idToObjectDictionary[id];
        if (userObject === undefined) {
            continue;
        }
        // put the assigned user in eligibleIDs, regardless
        if (userObject.assignedScheduledShifts !== undefined && userObject.assignedScheduledShifts.includes(shiftID)) {
            eligibleIDs.push(id)
            continue;
        }
        // push them on the list if the hours they need >= creditHours
        const assignableHours: number = HOURS_REQUIRED - userObject.hoursAssigned;
        if (assignableHours >= creditHours) {
            eligibleIDs.push(id);
        }
    }
    return eligibleIDs;
}

/**
 * Returns a list of user ids that are sorted, first on whether they prefer the shift and second as a tiebreaker on the number of unassigned hours (higher is higher priority)
 *
 * @param shiftObject - The shift object
 * @param ids - The list of entity ids
 * @param entityState - the entity state from redux
 * @returns A sorted list of the entity ids that are passed in
*/
const sortUsersByNeededHoursAndPreference = (ids: EntityId[], entityState: EntityState<User>, shiftObject: Shift) => {
    const idToObjectDictionary: Dictionary<User> = entityState.entities;
    const likedList = shiftObject.preferences.preferredBy;
    const dislikedList = shiftObject.preferences.dislikedBy;
    const sorted = ids.sort((id1, id2) => {
        const user1 = idToObjectDictionary[id1];
        const user2 = idToObjectDictionary[id2];
        if (user1 === undefined || user2 === undefined) {
          return 0;
        }
        // First sort on preferences
        let user1Preference = NEUTRAL_PREFERENCE;
        if (likedList.includes("" + id1)) {;
            user1Preference = LIKED_PREFERENCE;
        } else if (dislikedList.includes("" + id1)) {
            user1Preference = DISLIKED_PREFERENCE;
        }
        let user2Preference = NEUTRAL_PREFERENCE;
        if (likedList.includes("" + id2)) {
            user2Preference = LIKED_PREFERENCE;
        } else if (dislikedList.includes("" + id2)) {
            user2Preference = DISLIKED_PREFERENCE;
        }
        if (user2Preference - user1Preference != 0) {
            return user2Preference - user1Preference;
        }
        // Second sort on hours assignable leftr, prioritizing people with higher preferences (user2 - user1)
        const user1HoursLeft = HOURS_REQUIRED - user1.hoursAssigned
        const user2HoursLeft = HOURS_REQUIRED - user2.hoursAssigned
        return user2HoursLeft - user1HoursLeft;
    })
    return sorted;
}

/**
 * Returns a list of user ids that are available and eligible to complete the shift; returns it in sorted order
 *
 * @param shiftObject - The shift object
 * @param days - The days that we iterate through
 * @param entityState - the entity state from redux
 * @returns A list of user ids that are available and eligible to complete the shift; returns it in sorted order
*/
export const createListOfUsersForShift = (shiftObject: Shift, entityState: EntityState<User>, days: string[]) => { 
    const availableIDs = filterUsersByAvailability(shiftObject, days, entityState);
    const availableAndEligibleIDs = filterUsersByEligibility(availableIDs, entityState, shiftObject.hours, shiftObject.shiftID);
    const sortedAvailableAndEligibleIDs = sortUsersByNeededHoursAndPreference(availableAndEligibleIDs, entityState, shiftObject);
    return sortedAvailableAndEligibleIDs;
}