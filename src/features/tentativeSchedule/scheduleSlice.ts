import { RootState } from '@/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'

//** [UserId]:{[day]:Array<shiftIds>}  */
type UserScheduleType = {
  [key: string]: { [key: string]: string[] }
}
//** [ShiftId]:{[day]:Array<userIds>}  */
type ShiftScheduleType = {
  [key: string]: { [key: string]: string[] }
}

//** [day]:Array<shiftIds>  */
type EmptyShiftsType = {
  [key: string]: Array<string>
}

//** [userId]: {[day]: Array<shiftIds>} */
export type AssignedUserShiftsType = {
  [key: string]: { [key: string]: Array<string> }
}

const userSchedule: UserScheduleType = {}
const shiftSchedule: ShiftScheduleType = {}
const emptyShifts: EmptyShiftsType = {}
const assignedUserShifts: AssignedUserShiftsType = {}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    userSchedule,
    shiftSchedule,
    emptyShifts,
    assignedUserShifts,
    hasPublishBtn: false,
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
      const days = Object.keys(day.toLowerCase())
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
    setShiftsSchedule: (state, action) => {
      const { shiftsSchedule } = action.payload
      if (!shiftsSchedule) {
        console.log('[scheduleSlice]: shiftsSchedule is undefined')
        return
      }
      // console.log({ shiftsSchedule: shiftsSchedule })
      state.shiftSchedule = shiftsSchedule
    },
    setAssignedUserShifts: (state, action) => {
      state.assignedUserShifts = action.payload ?? assignedUserShifts
    },
    setEmptyShifts: (state, action) => {
      state.emptyShifts = action.payload ?? emptyShifts
    },
    setHasPublishBtn: (state, action) => {
      state.hasPublishBtn = action.payload
    },
  },
})

export const {
  setUsersSchedule,
  setShiftsSchedule,
  setUserSchedule,
  setUserWeekDaySchedule,
  setAssignedUserShifts,
  setEmptyShifts,
  setHasPublishBtn,
} = scheduleSlice.actions

export const selectHasPublishBtn = (state: RootState) =>
  state.schedules.hasPublishBtn

export const selectUserSchedule = (state: RootState) =>
  state.schedules.userSchedule

export const selectShiftSchedule = (state: RootState) =>
  state.schedules.shiftSchedule

export const selectAssignedUserShifts = (state: RootState) =>
  state.schedules.assignedUserShifts ?? assignedUserShifts

const selectUserScheduleWithId = (state: RootState, userId: string) =>
  state.schedules.userSchedule[userId]

const selectUserScheduleWithIdDay = (
  state: RootState,
  userId: string,
  dayId: string
) => state.schedules.userSchedule[userId]?.[dayId.toLowerCase()] ?? []

const selectShiftScheduleWithId = (state: RootState, shiftId: string) =>
  state.schedules.shiftSchedule[shiftId]

const selectShiftScheduleWithIdDay = (
  state: RootState,
  shiftId: string,
  dayId: string
) => state.schedules.shiftSchedule[shiftId]?.[dayId.toLowerCase()] ?? []

const selectAssignedUserShiftsWithId = (state: RootState, userId: string) =>
  state.schedules.assignedUserShifts[userId] ?? {}

const selectAssignedUserShiftsWithIdDay = (
  state: RootState,
  userId: string,
  dayId: string
) => state.schedules.assignedUserShifts[userId]?.[dayId.toLowerCase()] ?? []

const selectEmptyShiftsWithDay = (state: RootState, dayId: string) =>
  state.schedules.emptyShifts[dayId.toLowerCase()] ?? []

export const selectUserScheduleById = createSelector(
  [selectUserScheduleWithId],
  (userSchedule) => userSchedule ?? []
)

export const selectUserScheduleByIdDay = createSelector(
  [selectUserScheduleWithIdDay],
  (daySchedule) => daySchedule ?? []
)

export const selectShiftScheduleById = createSelector(
  [selectShiftScheduleWithId],
  (shiftSchedule) => shiftSchedule ?? []
)

export const selectShiftScheduleByIdDay = createSelector(
  [selectShiftScheduleWithIdDay],
  (daySchedule) => daySchedule ?? []
)

export const selectAssignedUserShiftsById = createSelector(
  selectAssignedUserShiftsWithId,
  (assignedShifts) => assignedShifts ?? {}
)

export const selectAssignedUserShiftsByIdDay = createSelector(
  selectAssignedUserShiftsWithIdDay,
  (assignedDayShifts) => assignedDayShifts ?? []
)
export const selectEmptyShiftsByDay = createSelector(
  selectEmptyShiftsWithDay,
  (emptyShifts) => emptyShifts ?? []
)

// export const selectUserAssignedDayScheduleByDay = createSelector(
//   [selectUserAssignedDayScheduleWithDay],
//   (daySchedule) => daySchedule
// )

export default scheduleSlice.reducer
