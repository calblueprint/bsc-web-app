import { RootState } from '@/store/store'
import { ShiftPreferences, User } from '@/types/schema'
import { createHouseCategories, validatePreferences } from '@/utils/utils'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import PreferencesTable from './tables/PreferencesTable'

const shiftPreferences: {
  [key: string]: { preferredBy: []; dislikedBy: []; isActive: true }
} = {}

const shiftsByCategory: { [key: string]: Array<string> } = {}

const categoryCollapse: { [key: string]: boolean } = {}

const userShiftPreferencesSlice = createSlice({
  name: 'userShiftPreferences',
  initialState: {
    shiftPreferences,
    shiftsByCategory,
    categoryCollapse,
    isEditingPreferences: false,
    isUpdatingPreferences: false,
  },
  reducers: {
    setShiftPreferences: (state, action) => {
      state.shiftPreferences = {
        ...state.shiftPreferences,
        ...action.payload.preferences,
      }
    },
    setShiftsByCategories: (state, action) => {
      state.shiftsByCategory = {
        ...state.shiftsByCategory,
        ...action.payload.houseCategories,
      }
    },
    setCategoryCollapse: (state, action) => {
      state.categoryCollapse = {
        ...state.categoryCollapse,
        ...action.payload.collapseOpen,
      }
    },
    setIsEditingPreferences: (state, action) => {
      // console.log(action.payload.isEditing)
      state.isEditingPreferences = action.payload.isEditing
    },
    setIsUpdatingPreferences: (state, action) => {
      state.isUpdatingPreferences = action.payload.isUpdating
    },
  },
})

export const {
  setShiftPreferences,
  setShiftsByCategories,
  setCategoryCollapse,
  setIsEditingPreferences,
  setIsUpdatingPreferences,
} = userShiftPreferencesSlice.actions

export const selectUserShiftPreferences = (state: RootState) =>
  state.userShiftPreferences.shiftPreferences

export const selectIsEditingPreferences = (state: RootState) =>
  state.userShiftPreferences.isEditingPreferences

export const selectIsUpdatingPreferences = (state: RootState) =>
  state.userShiftPreferences.isUpdatingPreferences

export const selectShiftByCategory = (state: RootState, category: string) =>
  state.userShiftPreferences.shiftsByCategory[category]

export const selectCatogoryCollapse = (state: RootState, category: string) =>
  state.userShiftPreferences.categoryCollapse[category]

export const selectCatogoryCollapseByCategory = createSelector(
  [selectCatogoryCollapse],
  (isOpen) => isOpen
)

export const selectShiftsByCategoryPreferences = createSelector(
  [selectUserShiftPreferences, selectShiftByCategory],
  (preferences, categoryIds) => {
    let obj: {
      [key: string]: {
        preferredBy: Array<string>
        dislikedBy: Array<string>
        isActive: boolean
      }
    } = {}
    categoryIds.map((id) => {
      obj = { ...obj, [id]: preferences[id] }
    })
    return obj
  }
)

export default userShiftPreferencesSlice.reducer
