import { RootState } from '@/store/store'
import { ShiftPreferences, User } from '@/types/schema'
import { validatePreferences } from '@/utils/utils'
import { createSlice } from '@reduxjs/toolkit'
import PreferencesTable from './tables/PreferencesTable'

const shiftPreferences: { [key: string]: ShiftPreferences } = {}

const userShiftPreferencesSlice = createSlice({
  name: 'userShiftPreferences',
  initialState: {
    shiftPreferences,
    isEditingPreferences: false,
    resetPreferences: true,
    isUpdatingPreferences: false,
  },
  reducers: {
    setShiftPreferences: (state, action) => {
      const { allPreferences, category } = action.payload
      const newShiftPreferences = { [category]: allPreferences }
      //   console.log('Redux setShiftPreferences: ', allPreferences)
      state.shiftPreferences = {
        ...state.shiftPreferences,
        ...newShiftPreferences,
      }
    },
    setSingleShiftPreferences: (state, action) => {
      const { preference, category } = action.payload
      //   console.log('Redux setSingleShiftPreferences: ', preference)
      const p = { ...state.shiftPreferences[category] }
      const newPref = { ...state.shiftPreferences[category], ...preference }
      //   console.log(
      //     'Redux newPre: ',
      //     JSON.stringify(state.shiftPreferences[category])
      //   )
      //   console.log('Redux newPre: ', newPref)
      const newShiftPreferences = { [category]: newPref }
      state.shiftPreferences = {
        ...state.shiftPreferences,
        ...newShiftPreferences,
      }
    },
    setIsEditingPreferences: (state, action) => {
      console.log(action.payload.isEditing)
      state.isEditingPreferences = action.payload.isEditing
    },
    setResetPreferences: (state, action) => {
      state.resetPreferences = action.payload.resetPreferences
    },
    setIsUpdatingPreferences: (state, action) => {
      state.isUpdatingPreferences = action.payload.isUpdating
    },
  },
})

export const {
  setShiftPreferences,
  setSingleShiftPreferences,
  setIsEditingPreferences,
  setResetPreferences,
  setIsUpdatingPreferences,
} = userShiftPreferencesSlice.actions

export const selectUserShiftPreferences = (state: RootState) =>
  state.userShiftPreferences.shiftPreferences

export const selectIsEditingPreferences = (state: RootState) =>
  state.userShiftPreferences.isEditingPreferences

export const selectResetPreferences = (state: RootState) =>
  state.userShiftPreferences.resetPreferences

export const selectIsUpdatingPreferences = (state: RootState) =>
  state.userShiftPreferences.isUpdatingPreferences

export default userShiftPreferencesSlice.reducer
