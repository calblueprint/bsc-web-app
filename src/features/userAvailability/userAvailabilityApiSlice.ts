import { User } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState, store } from '../../store/store'
import { selectMemberAvailability } from './userAvailabilitySlice'

export const userAvailabilityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserAvailability: builder.mutation<User, { id: string }>({
      query: (arg) => {
        const { id } = arg
        // Access the Redux state and get the availability data
        const state = store.getState() as RootState
        const availabilities = selectMemberAvailability(state)

        return {
          url: `/users/${id}`,
          method: 'PATCH',
          // Include the availability data in the body
          body: { availabilities },
        }
      },

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          // console.log('[Refreshed]: Query Fulfilled: ', result)
          if (!result.data) {
            console.log('User and House object are empty')
            return
          }
          console.log(result.data)

          // return { data: arg }
        } catch (error) {
          console.log(error)
        }
      },
    }),
   
  }),
})

export const {
  useUpdateUserAvailabilityMutation,
} = userAvailabilityApiSlice

