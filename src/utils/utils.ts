import { EntityId, Dictionary } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import {User} from '../types/schema'
import { DAYS } from './constants'


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
  return word.charAt(0).toUpperCase() + word.slice(1)
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
  if(availabilities.length === 1) {
    return false
  }

  for (let i = 0; i < availabilities.length; i++) {
    if (i === index){
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
      return true;
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

  return false;
};

export const validateAvailability = (availability: User['availabilities'])=> {
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

  const verifiedAvailability = DAYS.forEach(day=> {
    if(availability[day]) {
      availabilities[day] = availability[day]
    }
  })
  return availabilities
}
