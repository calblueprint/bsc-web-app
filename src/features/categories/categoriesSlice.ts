import { RootState } from '@/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'

const isCategoryOpen: { [key: string]: boolean } = {}
const shiftsCategory: { [key: string]: Array<string> } = {}
const houseCategories: Array<string> = ['Uncategorized']
const houseId: string = ''

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    isCategoryOpen,
    houseCategories,
    shiftsCategory,
    houseId,
  },
  reducers: {
    setIsCategoryOpen: (state, action) => {
      state.isCategoryOpen = {
        ...state.isCategoryOpen,
        ...action.payload.isCategoryOpen,
      }
    },
    setShiftCategories: (state, action) => {
      state.shiftsCategory = {
        ...state.shiftsCategory,
        ...action.payload.shiftCategories,
      }
    },
    setHouseCategories: (state, action) => {
      state.houseCategories = action.payload.houseCategories
    },
    addHouseCategories: (state, action) => {
      state.houseCategories = [
        ...state.houseCategories,
        ...action.payload.houseCategories,
      ]
    },
    deleteHouseCategories: (state, action) => {
      const index = state.houseCategories.indexOf(action.payload.category)
      state.houseCategories = state.houseCategories.splice(index, 1)
    },
    setHouseId: (state, action) => {
      console.log(action.payload.houseId)
      state.houseId = action.payload.houseId
    },
  },
})

export const {
  setIsCategoryOpen,
  setShiftCategories,
  setHouseCategories,
  addHouseCategories,
  deleteHouseCategories,
  setHouseId,
} = categoriesSlice.actions

export const selectHouseCategories = (state: RootState) =>
  state.categories.houseCategories

export const selectHouseId = (state: RootState) => state.categories.houseId

export const selectShiftCategoriesByCategory = (
  state: RootState,
  category: string
) => state.categories.shiftsCategory[category]

export const selectShiftsCategory = createSelector(
  [selectShiftCategoriesByCategory],
  (shiftIds) => shiftIds
)

export const selectIsCategoryOpenByCategory = (
  state: RootState,
  category: string
) => state.categories.isCategoryOpen[category]

export const selectIsCategoryOpen = createSelector(
  [selectIsCategoryOpenByCategory],
  (isOpen) => isOpen
)

export default categoriesSlice.reducer
