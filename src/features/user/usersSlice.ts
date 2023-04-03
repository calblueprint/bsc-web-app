import { RootState } from '@/store/store'
import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    memberNavState: {
      id: 'Schedule',
      tab: 0,
      path: '/account/member',
      active: 0,
    },
    managerNavState: {
      id: 'Schedule',
      tab: 0,
      path: '/account/manager',
      active: 0,
    },
    supervisorNavState: {
      id: 'Schedule',
      tab: 0,
      path: '/account/supervisor',
      active: 0,
    },
    tabValue: 0,
    memberAvailability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  reducers: {
    setMemberNavState: (state, action) => {
      state.memberNavState = action.payload
    },
    setManagerNavState: (state, action) => {
      state.managerNavState = action.payload
    },
    setSupervisorNavState: (state, action) => {
      state.supervisorNavState = action.payload
    },
    setTabValue: (state, action) => {
      state.tabValue = action.payload
    },
    setMemberAvailability: (state, action) => {
      state.memberAvailability = action.payload
    },
    setMemberAvailabilityDay: (state, action) => {
      const { day, availabilityDay } = action.payload
      state.memberAvailability[day as keyof typeof state.memberAvailability] =
        availabilityDay
    },
  },
})

export const {
  setMemberNavState,
  setManagerNavState,
  setSupervisorNavState,
  setTabValue,
  setMemberAvailability,
  setMemberAvailabilityDay,
} = usersSlice.actions

export const selectMemberNavState = (state: RootState) =>
  state.users.memberNavState
export const selectManagerNavState = (state: RootState) =>
  state.users.managerNavState
export const selectSupervisorNavState = (state: RootState) =>
  state.users.supervisorNavState
export const selectTabValue = (state: RootState) => state.users.tabValue
export const selectMemberAvailability = (state: RootState) =>
  state.users.memberAvailability

export default usersSlice.reducer
