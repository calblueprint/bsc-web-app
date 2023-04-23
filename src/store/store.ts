import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/user/usersSlice'
import userAvailabilityReducer from '../features/userAvailability/userAvailabilitySlice'
// import userShiftPreferencesReducer from '../features/userShiftPreferences/userShiftPreferencesSlice'
import userShiftPreferencesReducer from '../features/userShiftPreferences/userShiftPreferencesSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import { apiSlice } from './api/apiSlice'
// import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    counter: counterReducer,
    auth: authReducer,
    users: usersReducer,
    userAvailability: userAvailabilityReducer,
    userShiftPreferences: userShiftPreferencesReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
