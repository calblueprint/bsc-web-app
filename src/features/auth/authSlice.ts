import { House, User } from '@/types/schema'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'

type InitialStateProps = {
  currentHouse: House | null
  currentUser: User | null
  currentRole: string
}

const initialState: InitialStateProps = {
  currentHouse: null,
  currentUser: null,
  currentRole: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, house } = action.payload
      state.currentUser = user
      state.currentHouse = house
    },

    setCurrentHouse: (state, action) => {
      state.currentHouse = action.payload
    },
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    logOut: (state) => {
      state.currentUser = null
      state.currentHouse = null
    },
  },
})

export const {
  setCredentials,
  logOut,
  setCurrentHouse,
  setCurrentUser,
  setCurrentRole,
} = authSlice.actions
export const selectCurrentHouse = (state: RootState) => state.auth.currentHouse
export const selectCurrentUser = (state: RootState) => state.auth.currentUser
export const selectCurrentRole = (state: RootState) => state.auth.currentRole

export default authSlice.reducer
