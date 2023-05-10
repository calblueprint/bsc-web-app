import React, { useEffect, useState } from 'react'
import { useGetHouseUsersQuery, useUpdateUserMutation } from '../userApiSlice'
import AvailabilitySampleData from './AvailabilitySampleData.json'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { House, User } from '@/types/schema'
import Button from '@mui/material/Button'

const SampleUserAvailability = () => {
  const [updateUser] = useUpdateUserMutation()
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: users } = useGetHouseUsersQuery(authHouse.id)
  const [userAvailabilities, setUserAvailabilities] = useState({})
  //   console.log(AvailabilitySampleData)

  const uploadData = () => {
    // console.log(userAvailabilities)

    for (const user in userAvailabilities) {
      //   console.log(user)
      try {
        const data = userAvailabilities[user as keyof typeof userAvailabilities]
        console.log(data)
        updateUser(data).unwrap()
      } catch (error) {
        console.log(error)
      }
    }

    // try {
    //   const data =
    //     userAvailabilities[
    //       'HC62k7PURDhoVeKfoFTb2bX2Uj52' as keyof typeof userAvailabilities
    //     ]
    //   console.log(data)
    //   updateUser(data)
    // } catch (error) {
    //   console.log(error)
    // }
  }

  useEffect(() => {
    if (users) {
      let uploadData = {}
      users.ids.forEach((userId, index) => {
        const availabilities = studentAvailabilities[index].availabilities
        const data = { userId, data: { availabilities } }
        uploadData = {
          ...uploadData,
          [userId]: data,
        }
      })
      //   console.log(uploadData)
      setUserAvailabilities(uploadData)
    }
  }, [users])
  return (
    <Button variant="contained" onClick={uploadData}>
      Upload Sample User Availabilities
    </Button>
  )
}

export default SampleUserAvailability

// ************************************************************************************************

type TimeInterval = {
  startTime: string
  endTime: string
}

type Availabilities = {
  [key: string]: TimeInterval[]
}

// function randomTimeInterval() {
//   const startHour = Math.floor(Math.random() * 15) + 8
//   const startMinute = Math.random() < 0.5 ? 0 : 30
//   const duration = Math.floor(Math.random() * 4) + 1 // Duration between 1 to 5 hours

//   const startTime = `${String(startHour).padStart(2, '0')}${String(
//     startMinute
//   ).padStart(2, '0')}`
//   const endHour = startHour + duration
//   const endTime = `${String(endHour).padStart(2, '0')}${String(
//     startMinute
//   ).padStart(2, '0')}`

//   return { startTime, endTime }
// }

function randomTimeInterval(): TimeInterval {
  const maxHour = 22
  const minHour = 8
  const startHour = Math.floor(Math.random() * (maxHour - minHour)) + minHour
  const startMinute = Math.random() < 0.5 ? 0 : 30
  const maxDuration = (23 - startHour) * 60
  const minDuration = 60
  const duration = Math.floor(
    Math.random() * (maxDuration - minDuration) + minDuration
  )

  const startTime = `${String(startHour).padStart(2, '0')}${String(
    startMinute
  ).padStart(2, '0')}`

  const endHour = Math.floor((startHour * 60 + startMinute + duration) / 60)
  const endMinute = endHour % 1 === 0.5 ? '30' : '00'
  const endTime = `${String(Math.floor(endHour)).padStart(2, '0')}${endMinute}`

  return { startTime, endTime }
}

function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (!intervals.length) return []

  intervals.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime))
  const result: TimeInterval[] = [intervals[0]]

  for (let i = 1; i < intervals.length; i++) {
    const currentInterval = intervals[i]
    const lastInterval = result[result.length - 1]

    if (parseInt(lastInterval.endTime) >= parseInt(currentInterval.startTime)) {
      lastInterval.endTime = Math.max(
        parseInt(lastInterval.endTime),
        parseInt(currentInterval.endTime)
      )
        .toString()
        .padStart(4, '0')
    } else {
      result.push(currentInterval)
    }
  }

  return result
}

const studentAvailabilities: { id: string; availabilities: Availabilities }[] =
  []

for (let i = 1; i <= 23; i++) {
  const availabilities: Availabilities = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  }

  for (const day in availabilities) {
    const numIntervals = Math.floor(Math.random() * 4) // Random number of intervals between 0 and 3
    const dayIntervals: TimeInterval[] = []

    for (let j = 0; j < numIntervals; j++) {
      const timeInterval = randomTimeInterval()
      dayIntervals.push(timeInterval)
    }

    availabilities[day] = mergeIntervals(dayIntervals)
  }

  studentAvailabilities.push({
    id: `student-${i}`,
    availabilities,
  })
}
