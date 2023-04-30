import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { User } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState, store } from '../../store/store'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
// import { selectMemberAvailability } from './usersSlice'
import { useEstablishContextMutation } from '../auth/authApiSlice'

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `users`,
        method: 'GET',

        params: { queryType: 'users' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: User[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedUsers = responseData.map((entity) => {
          // console.log('[loaddedUsers] entity: ', entity)
          // entity.id = entity.id
          return entity
        })
        console.log(loaddedUsers)
        return usersAdapter.setAll(initialState, loaddedUsers)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User' as const, id })),
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      },
    }),
    getHouseUsers: builder.query({
      query: (value: string) => ({
        url: `users`,
        method: 'GET',

        params: {
          filter: { fieldPath: 'houseID', optStr: '==', value },
        },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: User[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedUsers = responseData.map((entity) => {
          // console.log('[loaddedUsers] entity: ', entity)
          entity.id = entity.id
          return entity
        })
        console.debug(loaddedUsers)
        return usersAdapter.setAll(initialState, loaddedUsers)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User' as const, id })),
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      },
    }),
    addNewUser: builder.mutation({
      query: (data: { data: Partial<User> }) => ({
        url: `users`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (data: { userId: string; data: Partial<User> }) => ({
        url: `users/${data.userId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: arg.userId },
      ],
    }),
    // updateUserAvailability: builder.mutation<User, { id: string }>({
    //   query: (arg) => {
    //     const { id } = arg
    //     // Access the Redux state and get the availability data
    //     const state = store.getState() as RootState
    //     const availabilities = selectMemberAvailability(state)

    //     return {
    //       url: `/users/${id}`,
    //       method: 'PATCH',
    //       // Include the availability data in the body
    //       body: { availabilities },
    //     }
    //   },

    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       const result = await queryFulfilled
    //       // console.log('[Refreshed]: Query Fulfilled: ', result)
    //       if (!result.data) {
    //         console.log('User and House object are empty')
    //         return
    //       }
    //       console.log(result.data)
    //       // console.log(
    //       //   '[Refreshed]: Query Fulfilled:  --user: ',
    //       //   user,
    //       //   '  --house: ',
    //       //   house
    //       // )

    //       // return { data: arg }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   },
    // }),
    // deleteUser: builder.mutation({
    //   query: ({ id }) => ({
    //     url: '/users',
    //     method: 'DELETE',
    //     body: { id },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    // }),
  }),
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useGetHouseUsersQuery,
  // useUpdateUserAvailabilityMutation,
  //   useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({})

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entries
)

// getSelectors creates these selector and we rename them with aliases using destructing
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that return the user slice of a state
} = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState
)

// // Creates memoized selector to get normalized state based on the query parameter
// const selectUsersData = createSelector(
//   (state: RootState, queryParameter: string) =>
//     usersApiSlice.endpoints.getUsers.select(queryParameter)(state),
//   (usersResult) => usersResult.data ?? initialState
// )

// // Creates memoized selector to get a user by its ID based on the query parameter
// export const selectUserById = (queryParameter: string) =>
//   createSelector(
//     (state: RootState) => selectUsersData(state, queryParameter),
//     (_: unknown, userId: EntityId) => userId,
//     (data: { entities: { [x: string]: unknown } }, userId: string | number) =>
//       data.entities[userId]
//   )
