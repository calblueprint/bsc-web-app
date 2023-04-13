import { Dictionary, EntityId, EntityState } from "@reduxjs/toolkit";
import {Shift, User} from "../types/schema";
import { number } from "yup";
import dayjs, { Dayjs } from "dayjs";


// NEXT FUNCTION
// stores the number of hours that the user still has to complete
// const assignableHours = HOURS_REQUIRED - userObject.hoursAssigned;
// // if they have no hours left to complete, or their number of hours left to complete < the number of hours of the shift, continue
// if (assignableHours <= 0) {
//   continue
// }
const HOURS_REQUIRED = 5;
// TODO: DOESN'T WORK IF SOMEONE IS ALREADY ASSIGNED DURING THEIR AVAILABILITY PERIOD TO A DIFFERENT SHIFT
const filterUsersByAvailability = (shiftObject: Shift, days: string[], entityState: EntityState<User>) => {
  const numHours = Math.floor(shiftObject.hours);
  const numMinutes = (shiftObject.hours - numHours) * 60;
  // represented as dayjs object
  const shiftStart: Dayjs = dayjs(shiftObject.timeWindow.startTime, 'HHmm')
  const shiftEnd: Dayjs = dayjs(shiftObject.timeWindow.endTime, 'HHmm')
  const shiftID = shiftObject.shiftID;
  // Convert the hours of the shift into units of time. Assumes any non-whole hour numbers are 30 minute intervals.
  // ex. 1.5 -> converted to 130 (used for differences if someone is available between 1030 and 1200, they should be shown)
  let totalUsersInHouse: EntityId[] = entityState.ids;
  let availableUserIDs: EntityId[] = [];
  let idToObjectDictionary: Dictionary<User> = entityState.entities;
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
    // flag to determine if user id has been added to the list of available user ids already
    let isAdded = false;
    for (let j = 0; j < days.length; j++) {
        const day = days[j];
        if (!(day in currAvailabilities)) {
            continue;
        }
        const perDayAvailability = currAvailabilities[day];
        if (perDayAvailability === undefined) {
            continue;
        }
        for (let k = 0; k < perDayAvailability.length; k++) {
            const currInterval = perDayAvailability[k];
            let userStart: Dayjs = dayjs(currInterval.startTime, 'HHmm')
            let userEnd: Dayjs = dayjs(currInterval.endTime, 'HHmm')
            // if user's availability window ends before the start of the shift, can continue
            if (userEnd <= shiftStart) {
                continue;
            }
            // take max start
            let calculatedStart: Dayjs = shiftStart;
            if (userStart.isAfter(shiftStart)) {
                calculatedStart = userStart;
            }
            // must be able to add 1.5 hours or smth
            const calculatedEnd = calculatedStart.add(numHours, 'hour').add(numMinutes, 'minute');
            // take min end
            let calculatedEndRequirement: Dayjs = shiftEnd;
            if (userEnd.isBefore(shiftEnd)) {
                calculatedEndRequirement = userEnd;
            }
            if (calculatedEnd.isBefore(calculatedEndRequirement)) {
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

const filterUsersByEligibility = (ids: EntityId[], entityState: EntityState<User>, creditHours: number, shiftID: string) => {
    const eligibleIDs: EntityId[] = [];
    const idToObjectDictionary: Dictionary<User> = entityState.entities;
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const userObject = idToObjectDictionary[id];
        if (userObject === undefined) {
            continue;
        }
        // persist the assigned user
        if (userObject.assignedScheduledShifts !== undefined && userObject.assignedScheduledShifts.includes(shiftID)) {
            eligibleIDs.push(id)
            continue;
        }
        const assignableHours: number = HOURS_REQUIRED - userObject.hoursAssigned;
        if (assignableHours >= creditHours) {
            eligibleIDs.push(id);
        }
    }
    return eligibleIDs;
}

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
        let user1Preference = 1;
        let user2Preference = 1;
        if (id1 in likedList) {
            user1Preference = 2;
        } else if (id1 in dislikedList) {
            user1Preference = 0;
        }
        if (id2 in likedList) {
            user2Preference = 2;
        } else if (id2 in dislikedList) {
            user2Preference = 0;
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

const createListOfUsersForShift = (shiftObject: Shift, entityState: EntityState<User>, days: string[]) => { 
    const availableIDs = filterUsersByAvailability(shiftObject, days, entityState);
    const availableAndEligibleIDs = filterUsersByEligibility(availableIDs, entityState, shiftObject.hours, shiftObject.shiftID);
    const sortedAvailableAndEligibleIDs = sortUsersByNeededHoursAndPreference(availableAndEligibleIDs, entityState, shiftObject);
    return sortedAvailableAndEligibleIDs;
}