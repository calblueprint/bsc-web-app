import { RootState } from '@/store/store'
import { User } from '@/types/schema'
import { validateAvailability } from '@/utils/utils'
import { createSlice } from '@reduxjs/toolkit'

const memberAvailability: User['availabilities'] = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
}

const isInvalid: Record<string, boolean> = {}
const isOverlap: Record<string, boolean> = {}

const userAvailabilitySlice = createSlice({
  name: 'userAvailability',
  initialState: {
    memberAvailability,
    isInvalid,
    isOverlap,
    isAvailabilityError: false,
  },
  reducers: {
    setMemberAvailability: (state, action) => {
      state.isInvalid = {}
      state.isOverlap = {}
      state.isAvailabilityError = false
      state.memberAvailability = validateAvailability(action.payload)
    },
    setMemberAvailabilityDay: (state, action) => {
      // console.log(action.payload)
      state.isInvalid = {}
      state.isOverlap = {}
      state.isAvailabilityError = false

      const { day, availabilityDay } = action.payload
      // console.log(day, availabilityDay)
      const newAvailability = {
        ...state.memberAvailability,
        [day]: availabilityDay,
      }
      state.memberAvailability = newAvailability
    },
    setIsInvalid: (state, action) => {
      state.isInvalid = { ...state.isInvalid, ...action.payload }
    },
    setIsOverlap: (state, action) => {
      state.isOverlap = { ...state.isOverlap, ...action.payload }
    },
    // setDeleteInvalid: (state, action) => {
    //   const obj = {...state.isInvalid}
    //   if (obj[action.payload]) {
    //     delete obj[action.payload]
    //   }
    //   state.isInvalid = {...obj}
    // },
    // setDeleteOverlap: (state, action) => {
    //   const obj = {...state.isOverlap}
    //   // console.log('obj[action.payload]: ',obj[action.payload])
    //   if (obj[action.payload]) {
    //     console.log('action.payload: ',action.payload)
    //     console.log('before Delete: ',obj)
    //     delete obj[action.payload]
    //     console.log('after Delete: ',obj)
    //   }
    //   state.isInvalid = {...obj}
    // },
    setIsAvailabilityError: (state, action) => {
      state.isAvailabilityError = action.payload
    },
    // setResetStateError: (state, action) => {
    //   state.isInvalid = {}
    //   state.isOverlap = {}
    //   state.isAvailabilityError = false
    // }
  },
})

export const {
  setMemberAvailability,
  setMemberAvailabilityDay,
  setIsInvalid,
  setIsOverlap,
  // setDeleteInvalid,
  // setDeleteOverlap,
  // setResetStateError,
  setIsAvailabilityError,
} = userAvailabilitySlice.actions

export const selectMemberAvailability = (state: RootState) =>
  state.userAvailability.memberAvailability

export const selectIsInvalid = (state: RootState) =>
  state.userAvailability.isInvalid
export const selectIsOverlap = (state: RootState) =>
  state.userAvailability.isOverlap
export const selectIsAvailabilityError = (state: RootState) =>
  state.userAvailability.isAvailabilityError

export default userAvailabilitySlice.reducer
