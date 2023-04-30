import { EntityId, Dictionary, EntityState } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { House, Shift, User } from '../types/schema'
import { DAYS } from './constants'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(duration)
dayjs.extend(customParseFormat)

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export type Order = 'asc' | 'desc'

//** It needs to be any because this function will be used for shifts, users, etc. */

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | string[] | number[] },
  b: { [key in Key]: number | string | string[] | number[] }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(
  array: EntityId[],
  entities: Dictionary<T>,
  comparator: (a: T, b: T) => number
) {
  // const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  const stabilizedThis = array.map(
    (id: EntityId, index) => [entities[id], index, id] as [T, number, EntityId]
  )
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((id) => id[2])
}

export function formatMilitaryTime(militaryTime: number): string {
  // if (!militaryTime) return '00:00'
  const hour = Math.floor(militaryTime / 100)
  const minute = militaryTime % 100
  const isPM = hour >= 12

  // Convert hour to 12-hour format
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12

  // Add leading zero to minute if needed
  const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`

  // Add AM/PM indicator
  const ampm = isPM ? 'PM' : 'AM'

  // Return formatted time string
  return `${formattedHour}:${formattedMinute}${ampm}`
}

export const streamToObject = async (body: ReadableStream) => {
  if (!body || !(body instanceof ReadableStream)) throw new Error()

  const convert = async (stream: ReadableStream) => {
    let text = ''
    const reader = stream.getReader()
    let chunk = await reader.read()

    while (!chunk.done) {
      text += new TextDecoder('utf-8').decode(chunk.value)
      chunk = await reader.read()
    }
    return await JSON.parse(text)
  }
  const data = convert(body)

  return data
}

export function capitalizeFirstLetter(word: string) {
  if (!word || word.length < 2) return word
  const splittedWord = word.split(' ')
  const capWord = splittedWord.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )

  return capWord.join(' ')
}

/**
 * @description: Generates times in intervals of 30min
 *
 * @returns: options object -> [key]: value where the key is a string in military time such as: KEY= '0230' gives VALUE='2:30PM'
 */
export const generateTimeOptions = () => {
  // const options = []
  let options = {}
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const timeValue = dayjs().hour(i).minute(j).format('h:mm A')
      const timeKey = dayjs().hour(i).minute(j).format('HHmm')
      // console.log(timeKey, timeValue)
      options = { ...options, [timeKey]: timeValue }
      // options.push(time)
    }
  }

  options = { ...options, ['2359']: '11:59 PM' }
  return options
}

/**
 * @description: Array with all excepted military time key values for the
 *                object returned by the generateTimeOptions() function
 *
 * @returns: options array with all the posible times in military time
 */
export const generateTimeOptionsIndex = () => {
  let options = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const timeKey = dayjs().hour(i).minute(j).format('HHmm')
      // console.log(timeKey, timeValue)
      options.push(timeKey)
      // options.push(time)
    }
  }
  options.push('2359')
  return options
}

export const isTimeOverlap = (
  startTime: string,
  endTime: string,
  index: number,
  availabilities: Array<{ startTime: string; endTime: string }>
): boolean => {
  if (availabilities.length === 1) {
    return false
  }

  for (let i = 0; i < availabilities.length; i++) {
    if (i === index) {
      continue
    }
    const timeBlock = availabilities[i]
    if (
      (parseInt(startTime) >= parseInt(timeBlock.startTime) &&
        parseInt(startTime) < parseInt(timeBlock.endTime)) ||
      (parseInt(endTime) > parseInt(timeBlock.startTime) &&
        parseInt(endTime) <= parseInt(timeBlock.endTime)) ||
      (parseInt(startTime) < parseInt(timeBlock.startTime) &&
        parseInt(endTime) > parseInt(timeBlock.endTime))
    ) {
      return true
    }
  }

  // for (const timeBlock of availabilities) {
  //   if (
  //     (parseInt(startTime) >= parseInt(timeBlock.startTime) &&
  //       parseInt(startTime) < parseInt(timeBlock.endTime)) ||
  //     (parseInt(endTime) > parseInt(timeBlock.startTime) &&
  //       parseInt(endTime) <= parseInt(timeBlock.endTime)) ||
  //     (parseInt(startTime) < parseInt(timeBlock.startTime) &&
  //       parseInt(endTime) > parseInt(timeBlock.endTime))
  //   ) {
  //     return true;
  //   }
  // }

  return false
}

export const validateAvailability = (availability: User['availabilities']) => {
  const availabilities: User['availabilities'] = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }
  if (!availability) {
    return availabilities
  }

  const verifiedAvailability = DAYS.forEach((day) => {
    if (availability[day]) {
      availabilities[day] = availability[day]
    }
  })
  return availabilities
}

export const validatePreferences = (preferences: Shift['preferences']) => {
  let verifiedPreferences = { preferences: { preferredBy: [], dislikedBy: [] } }
  if (!preferences) {
    return { ...verifiedPreferences.preferences }
  }
  return { ...verifiedPreferences.preferences, ...preferences }
}

/**
 * @description Creates house categories given the ids and entities of all the shifts
 * @param ids holds the ids of all the shifts
 * @param entities holds the entities of all the shifts
 * @returns returns an map of of categories to array of shiftIds
 */
export const createHouseCategories = (
  ids: EntityId[],
  entities: Dictionary<Shift>
) => {
  const categories: { [key: string]: Array<string> } | undefined = {}
  if (!ids.length || !entities) {
    return undefined
  }
  ids.forEach((id) => {
    const category = entities[id]?.category
    if (category) {
      if (category in categories) {
        categories[category as keyof typeof categories].push(id as string)
      } else {
        categories[category] = [id as string]
      }
    } else {
      if ('Uncategorized' in categories) {
        categories['Uncategorized'].push(id as string)
      } else {
        categories['Uncategorized'] = [id as string]
      }
    }
  })

  return categories
}

export const getNumberOfBlocks = (startTime: string, endTime: string) => {
  const start = dayjs(startTime, 'HHmm')
    .startOf('minute')
    .add(Math.round(dayjs(startTime, 'HHmm').minute() / 30) * 30, 'minute')

  // Change the endTime from '2359' to '2350'
  const newEndTime = endTime === '2359' ? '2400' : endTime

  const end = dayjs(newEndTime, 'HHmm')
    .startOf('minute')
    .add(Math.round(dayjs(newEndTime, 'HHmm').minute() / 30) * 30, 'minute')

  const diff = end.diff(start)
  const blocks = diff / (1000 * 60 * 30)
  console.log(Math.round(blocks))
  return Math.round(blocks)
}

// export const generateMilitaryTimeForWeek = () => {
//   const militaryTimes = []
//   const minutesInterval = 30 // Set the interval between each time
//   const weekInMinutes = 7 * 24 * 60 // Calculate the total minutes in a week

//   let currentTime = dayjs().startOf('week') // Start at the beginning of the week

//   for (let i = 0; i < weekInMinutes; i += minutesInterval) {
//     // Format the current time as military time
//     const militaryTime = currentTime.format('HHmm')
//     militaryTimes.push(militaryTime)

//     // Increment the current time by the interval
//     currentTime = currentTime.add(minutesInterval, 'minute')
//   }

//   return militaryTimes
// }

export const generateContinuousMilitaryTimeForWeek = () => {
  const militaryTimes = []
  const minutesInterval = 30 // Set the interval between each time
  const weekInMinutes = 8 * 24 * 60 // Calculate the total minutes in a week

  let currentTime = dayjs().startOf('week') // Start at the beginning of the week

  for (let i = 0; i < weekInMinutes; i += minutesInterval) {
    // Calculate the total minutes from the start of the week
    const totalMinutes = currentTime.diff(dayjs().startOf('week'), 'minute')

    // Convert total minutes to military time
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const militaryTime =
      String(hours).padStart(2, '0') + String(minutes).padStart(2, '0')

    militaryTimes.push(militaryTime)

    // Increment the current time by the interval
    currentTime = currentTime.add(minutesInterval, 'minute')
  }

  return militaryTimes
}

type TimeInterval = {
  startTime: string
  endTime: string
}

export function findAvailableShiftsForUsers(
  userState: EntityState<User>,
  shiftState: EntityState<Shift>
): Record<string, Record<string, string[]>> {
  const users = userState.ids.map((id) => userState.entities[id]) as User[]
  const shifts = shiftState.ids.map((id) => shiftState.entities[id]) as Shift[]

  const availableShifts: Record<string, Record<string, string[]>> = {}

  // Helper function to check if there is enough overlap between two time intervals
  function hasEnoughOverlap(
    interval1: TimeInterval,
    interval2: TimeInterval,
    requiredDuration: number
  ): boolean {
    const startTime = Math.max(
      dayjs(interval1.startTime, 'HHmm').unix(),
      dayjs(interval2.startTime, 'HHmm').unix()
    )
    const endTime = Math.min(
      dayjs(interval1.endTime, 'HHmm').unix(),
      dayjs(interval2.endTime, 'HHmm').unix()
    )

    return endTime - startTime >= requiredDuration * 60 * 60
  }

  for (const user of users) {
    if (!user.id || !user.availabilities) {
      console.log({ user: user })
      throw new Error('Invalid user object')
    }

    availableShifts[user.id] = {}

    for (const shift of shifts) {
      if (
        !shift.id ||
        !shift.possibleDays ||
        !shift.timeWindow ||
        !shift.hours ||
        shift.hours < 0
      ) {
        console.log({ shift: shift })
        throw new Error('Invalid shift object')
      }

      for (const day of shift.possibleDays) {
        const lowerCaseDay = day.toLowerCase()
        const userAvailability = user.availabilities[lowerCaseDay]

        if (userAvailability) {
          for (const userTime of userAvailability) {
            // console.log({ userTime: userTime }, { shiftTime: shift.timeWindow })
            if (
              hasEnoughOverlap(
                userTime,
                {
                  startTime: String(shift.timeWindow.startTime),
                  endTime: String(shift.timeWindow.endTime),
                },
                shift.hours
              )
            ) {
              if (!availableShifts[user.id][lowerCaseDay]) {
                availableShifts[user.id][lowerCaseDay] = []
              }
              availableShifts[user.id][lowerCaseDay].push(shift.id)
              break
            }
          }
        }
      }
    }
  }

  return availableShifts
}

export function findAssignedShiftsForUsers(
  userState: EntityState<User>,
  shiftState: EntityState<Shift>
): Record<string, Record<string, string[]>> {
  const assignedShifts: Record<string, Record<string, string[]>> = {}

  userState.ids.forEach((userId) => {
    const user = userState.entities[userId]
    if (!user || !user.id || !user.availabilities) {
      throw new Error(`Invalid user object for user ID ${userId}`)
    }

    assignedShifts[user.id] = {}

    shiftState.ids.forEach((shiftId) => {
      const shift = shiftState.entities[shiftId]
      if (
        !shift ||
        !shift.id ||
        !shift.possibleDays ||
        !shift.timeWindow ||
        !shift.hours ||
        shift.hours < 0
      ) {
        throw new Error(`Invalid shift object for shift ID ${shiftId}`)
      }

      if (!shift.assignedUser || !shift.assignedDay) {
        return
      }

      if (shift.assignedUser === userId) {
        console.log(`Assigned User: ${shift.assignedUser} --> ${userId}`)
        const lowerCaseDay = shift.assignedDay.toLowerCase()
        assignedShifts[userId][lowerCaseDay] ??= []
        assignedShifts[userId][lowerCaseDay].push(shiftId as string)
      }
    })
  })

  return assignedShifts
}

export function findEmptyShifts(
  shiftState: EntityState<Shift>
): Record<string, string[]> {
  const emptyShifts: Record<string, string[]> = {}

  let count = 0
  shiftState.ids.forEach((id) => {
    const shift = shiftState.entities[id]
    // console.log(shift)
    if (!shift) {
      console.log('Undefinded shift: ', id)
      return
    }
    // console.log(
    //   '-------------',
    //   {
    //     assignedUser: shift.assignedUser,
    //     assignedDay: shift.assignedDay,
    //   },
    //   ' Count: ',
    //   count
    // )
    count += 1
    if (
      !shift.id ||
      !shift.possibleDays ||
      !shift.timeWindow ||
      !shift.hours ||
      shift.hours < 0
    ) {
      console.log({ shift: shift })
      throw new Error('Invalid shift object')
    }

    if (shift.assignedUser && shift.assignedDay) {
      // console.log('+++', {
      //   assignedUser: shift.assignedUser,
      //   assignedDay: shift.assignedDay,
      // })
      return
    }

    for (const day of shift.possibleDays) {
      const lowerCaseDay = day.toLowerCase()
      if (!emptyShifts[lowerCaseDay]) {
        emptyShifts[lowerCaseDay] = []
      }
      emptyShifts[lowerCaseDay].push(shift.id)
    }
  })

  // console.log('EMPTYSHIFTS: ', emptyShifts)

  return emptyShifts
}

type UserProperty = keyof User

export function sortUserIdsByProperty(
  state: EntityState<User>,
  property: UserProperty
): (string | number)[] {
  const sortedIds = [...state.ids] as (string | number)[]

  sortedIds.sort((idA, idB) => {
    const userA = state.entities[idA]
    const userB = state.entities[idB]

    if (userA && userB) {
      if (property in userA && property in userB) {
        // Use type assertion to inform TypeScript about the expected types
        const valueA = userA[property] as unknown as number
        const valueB = userB[property] as unknown as number

        if (valueA < valueB) {
          return -1
        } else if (valueA > valueB) {
          return 1
        }
      }
    }
    return 0
  })

  return sortedIds
}
export const pluralizeHours = (hours: number) => {
  if (hours === 1) {
    return hours + ' hour'
  }
  return hours + ' hours'
}
