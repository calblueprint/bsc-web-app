import { RootState } from '@/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

const weeklyScheduleShifts: Record<number, string[]> = {}

const scheduledShiftSlice = createSlice({
  name: 'scheduledShifts',
  initialState: {
    hasWeekSelectBtn: false,
    weekNumberSelected: dayjs().week(),
    weeklyScheduleShifts,
    weekDateSelected: dayjs().format('MM/DD/YYYY'),
  },
  reducers: {
    setWeeklyScheduleShifts: (state, action) => {
      state.weeklyScheduleShifts = action.payload
    },
    setHasWeekSelectBtn: (state, action) => {
      state.hasWeekSelectBtn = action.payload
    },
    setWeekNumberSelected: (state, action) => {
      state.weekNumberSelected = action.payload
    },
    setWeekDateSelected: (state, action) => {
      state.weekDateSelected = action.payload
      state.weekNumberSelected = dayjs(action.payload, 'MM/DD/YYYY').week()
    },
  },
})

export const {
  setHasWeekSelectBtn,
  setWeekNumberSelected,
  setWeeklyScheduleShifts,
  setWeekDateSelected,
} = scheduledShiftSlice.actions

export const selectWeeklyScheduleShiftsByWeekNumber = (state: RootState) =>
  state.scheduledShifts.weeklyScheduleShifts[
    state.scheduledShifts.weekNumberSelected
  ] ?? []

export const selectWeekDateSelected = (state: RootState) =>
  state.scheduledShifts.weekDateSelected ?? dayjs().format('MM/DD/YYYY')

export const selectHasWeekSelectBtn = (state: RootState) =>
  state.scheduledShifts.hasWeekSelectBtn

export const selectWeekNumberSelected = (state: RootState) =>
  state.scheduledShifts.weekNumberSelected

export default scheduledShiftSlice.reducer
