import { RootState } from '@/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'

type UserScheduleType = {
  [key: string]: { [key: string]: string[] }
}
const userSchedule: UserScheduleType = {}
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    userSchedule,
  },
  reducers: {
    setUsersSchedule: (state, action) => {
      const { usersSchedule } = action.payload
      if (!usersSchedule) {
        console.log('[scheduleSlice]: usersSchedule is undefined')
        return
      }
      //   console.log({ usersSchedule: usersSchedule })
      state.userSchedule = usersSchedule
    },
    setUserSchedule: (state, action) => {
      const { userId, weekSchedule } = action.payload
      if (!userId || !weekSchedule) {
        console.log('[scheduleSlice]: User or weekSchedule is undefined')
        return
      }
      const days = Object.keys(weekSchedule)
      if (!days.length) {
        console.log('[scheduleSlice]: WeekSchedule is empty')
        return
      }
      state.userSchedule = { ...state.userSchedule, [userId]: weekSchedule }
    },
    setUserWeekDaySchedule: (state, action) => {
      const { userId, day, dayObject } = action.payload
      if (!userId || !day) {
        console.log('[scheduleSlice]: User or day is undefined')
        return
      }
      const days = Object.keys(day)
      if (!days.length) {
        console.log('[scheduleSlice]: WeekSchedule is empty')
        return
      }
      if (state.userSchedule.hasOwnProperty(userId)) {
        state.userSchedule = {
          ...state.userSchedule,
          [userId]: { ...state.userSchedule[userId], [day]: dayObject[day] },
        }
      } else {
        state.userSchedule = {
          ...state.userSchedule,
          [userId]: { [day]: dayObject[day] },
        }
      }
    },
  },
})

export const { setUsersSchedule, setUserSchedule, setUserWeekDaySchedule } =
  scheduleSlice.actions

export const selectUserSchedule = (state: RootState) =>
  state.schedules.userSchedule

const selectUserScheduleWithId = (state: RootState, userId: string) =>
  state.schedules.userSchedule[userId]

const selectUserDayScheduleWithDay = (
  state: RootState,
  userId: string,
  dayId: string
) => {
  //   console.log('userId: ', userId, ' dayId: ', dayId)

  if (
    state.schedules.userSchedule.hasOwnProperty(userId) &&
    state.schedules.userSchedule[userId].hasOwnProperty(dayId)
  ) {
    // console.log(
    //   'schedules.userSchedule: ',
    //   state.schedules.userSchedule[userId][dayId]
    // )
    return state.schedules.userSchedule[userId][dayId]
  }
  return []
}

// export const selectUserScheduleById = (state: RootState, userId:string) => state.schedules.userSchedule[userId]

export const selectUserScheduleById = createSelector(
  [selectUserScheduleWithId],
  (userSchedule) => userSchedule
)

export const selectUserDayScheduleByDay = createSelector(
  [selectUserDayScheduleWithDay],
  (daySchedule) => daySchedule
)

export default scheduleSlice.reducer
