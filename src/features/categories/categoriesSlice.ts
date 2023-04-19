import { RootState } from '@/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'

const isCategoryOpen: { [key: string]: boolean } = {}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    isCategoryOpen,
  },
  reducers: {
    setIsCategoryOpen: (state, action) => {
      state.isCategoryOpen = {
        ...state.isCategoryOpen,
        ...action.payload.isCategoryOpen,
      }
    },
  },
})

export const { setIsCategoryOpen } = categoriesSlice.actions

export const selectIsCategoryOpenByCategory = (
  state: RootState,
  category: string
) => state.categories.isCategoryOpen[category]

export const selectIsCategoryOpen = createSelector(
  [selectIsCategoryOpenByCategory],
  (isOpen) => isOpen
)

export default categoriesSlice.reducer
