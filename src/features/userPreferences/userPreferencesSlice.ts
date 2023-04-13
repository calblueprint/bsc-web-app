import { RootState } from '@/store/store'
import { ShiftPreferences, User } from '@/types/schema'
import { validatePreferences } from '@/utils/utils'
import { createSlice } from '@reduxjs/toolkit'

const shiftPreferences: { [key: string]: ShiftPreferences } = {}

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: {
    shiftPreferences,
  },
  reducers: {
    setShiftPreferences: (state, action) => {
      const { allPreferences, category } = action.payload
      const newShiftPreferences = { [category]: allPreferences }
      console.log('Redux setShiftPreferences: ', allPreferences)
      state.shiftPreferences = {
        ...state.shiftPreferences,
        ...newShiftPreferences,
      }
    },
    setSingleShiftPreferences: (state, action) => {
      const { preference, category } = action.payload
      const newShiftPreferences = { [category]: preference }
      state.shiftPreferences = {
        ...state.shiftPreferences,
        ...newShiftPreferences,
      }
    },
  },
})

export const { setShiftPreferences, setSingleShiftPreferences } =
  userPreferencesSlice.actions

export const selectUserPreferences = (state: RootState) =>
  state.userPreferences.shiftPreferences

export default userPreferencesSlice.reducer
