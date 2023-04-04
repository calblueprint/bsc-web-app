import { RootState } from '@/store/store'
import { createSlice } from '@reduxjs/toolkit'

const userAvailabilitySlice = createSlice({
  name: 'userAvailability',
  initialState: {
   
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
    setMemberAvailability: (state, action) => {
      state.memberAvailability = action.payload
    },
    setMemberAvailabilityDay: (state, action) => {
      console.log(action.payload)
      const { day, availabilityDay } = action.payload
      console.log(day, availabilityDay)
      const newAvailability = {
        ...state.memberAvailability,
        [day]: availabilityDay,
      }
      state.memberAvailability = newAvailability
    },
  },
})

export const {

  setMemberAvailability,
  setMemberAvailabilityDay,
} = userAvailabilitySlice.actions


export const selectMemberAvailability = (state: RootState) =>
  state.userAvailability.memberAvailability

export default userAvailabilitySlice.reducer
