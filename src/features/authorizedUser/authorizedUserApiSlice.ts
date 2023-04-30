import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { AuthorizedUser, User } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState } from '../../store/store'

const authorizedUsersAdapter = createEntityAdapter<AuthorizedUser>({})

const initialState = authorizedUsersAdapter.getInitialState()

export const authorizedUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthorizedUsers: builder.query({
      query: () => ({
        url: `authorizedUsers`,
        method: 'GET',
        params: { queryType: 'authorized users' },
      }),
      transformResponse: (responseData: AuthorizedUser[]) => {
        const loadedAuthorizedUsers = responseData.map((entity) => {
          entity.id = entity.id
          return entity
        })
        console.debug(loadedAuthorizedUsers)
        return authorizedUsersAdapter.setAll(
          initialState,
          loadedAuthorizedUsers
        )
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'AuthorizedUser', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'AuthorizedUser' as const,
              id,
            })),
          ]
        } else return [{ type: 'AuthorizedUser', id: 'LIST' }]
      },
    }),
    getHouseAuthorizedUsers: builder.query({
      query: (value: string) => ({
        url: `authorizedUsers`,
        method: 'GET',
        params: { filter: { fieldPath: 'houseID', opStr: '==', value } },
      }),
      transformResponse: (responseData: AuthorizedUser[]) => {
        const loadedAuthorizedUsers = responseData.map((entity) => {
          entity.id = entity.id
          return entity
        })
        console.debug(loadedAuthorizedUsers)
        return authorizedUsersAdapter.setAll(
          initialState,
          loadedAuthorizedUsers
        )
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'AuthorizedUser', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'AuthorizedUser' as const,
              id,
            })),
          ]
        } else return [{ type: 'AuthorizedUser', id: 'LIST' }]
      },
    }),
    addNewAuthorizedUser: builder.mutation({
      query: (data: Partial<AuthorizedUser>) => ({
        url: `authorizedUsers`,
        method: 'POST',
        body: {
          ...data,
        },
      }),
      invalidatesTags: [{ type: 'AuthorizedUser', id: 'LIST' }],
    }),
    updateAuthorizedUser: builder.mutation({
      query: (data: { userId: string; data: Partial<AuthorizedUser> }) => ({
        url: `authorizedUsers/${data.userId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'AuthorizedUser', id: arg.userId },
      ],
    }),
    //TODO DELETEAUTHORIZEDUSERS
  }),
})

export const {
  useGetAuthorizedUsersQuery,
  useAddNewAuthorizedUserMutation,
  useUpdateAuthorizedUserMutation,
  useGetHouseAuthorizedUsersQuery,
} = authorizedUsersApiSlice

// Creates memoized selector to get normalized state based on the query parameter
const selectAuthorizedUsersData = createSelector(
  (state: RootState, queryParameter: string) =>
    authorizedUsersApiSlice.endpoints.getAuthorizedUsers.select(queryParameter)(
      state
    ),
  (authorizedUsersResult) => authorizedUsersResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectAuthorizedUsersById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectAuthorizedUsersData(state, queryParameter),
    (_: unknown, authorizedUserId: EntityId) => authorizedUserId,
    (
      data: { entities: { [x: string]: unknown } },
      authorizedUserId: string | number
    ) => data.entities[authorizedUserId]
  )
