import { RootState } from '@/store/store'
import { createSlice } from '@reduxjs/toolkit'

const userAssignmentSlice = createSlice({
  name: 'userAssignment',
  initialState: {
    selectedUserId: '',
  },
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload.selectedUserId
    },
  },
})

export const { setSelectedUserId } = userAssignmentSlice.actions

export const selectSelectedUserId = (state: RootState) =>
  state.userAssignment.selectedUserId

export default userAssignmentSlice.reducer
