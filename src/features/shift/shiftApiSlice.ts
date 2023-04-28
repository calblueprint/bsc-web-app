import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { Shift } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState } from '../../store/store'
import { formatMilitaryTime } from '../../utils/utils'

const shiftsAdapter = createEntityAdapter<Shift>({})

const initialState = shiftsAdapter.getInitialState()

export const shiftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: (houseId: string) => ({
        url: `houses/${houseId}/shifts`,
        method: 'GET',
        data: { body: 'hello world' },
        params: { queryType: 'shifts' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: Shift[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedShifts = responseData.map((entity) => {
          // console.log('[loaddedShifts] entity: ', entity)
          entity.id = entity.id
          if (!entity.timeWindowDisplay) {
            entity.timeWindowDisplay =
              formatMilitaryTime(entity.timeWindow.startTime) +
              ' - ' +
              formatMilitaryTime(entity.timeWindow.endTime)
          }
          return entity
        })
        console.debug(loaddedShifts)
        return shiftsAdapter.setAll(initialState, loaddedShifts)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'Shift', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Shift' as const, id })),
          ]
        } else return [{ type: 'Shift', id: 'LIST' }]
      },
    }),
    addNewShift: builder.mutation({
      query: (data: { houseId: string; data: Partial<Shift> }) => ({
        url: `houses/${data.houseId}/shifts`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),
    updateShift: builder.mutation({
      query: (data: {
        houseId: string
        shiftId: string
        data: Partial<Shift>
      }) => ({
        url: `houses/${data.houseId}/shifts/${data.shiftId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Shift', id: arg.shiftId },
      ],
    }),
    // deleteShift: builder.mutation({
    //   query: ({ id }) => ({
    //     url: '/shifts',
    //     method: 'DELETE',
    //     body: { id },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg.id }],
    // }),
  }),
})

export const {
  useGetShiftsQuery,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
  //   useDeleteShiftMutation,
} = shiftsApiSlice

export const selectShiftById = () => {
  return createSelector(
    (state: RootState, shiftId: EntityId, queryParameter: string) =>
      shiftsApiSlice.endpoints.getShifts.select(queryParameter)(state).data ??
      initialState,
    (_: RootState, shiftId: EntityId) => shiftId,
    (data, shiftId) => data.entities[shiftId] as Shift
  )
}

export const selectMultipleAssignedShiftById = () => {
  return createSelector(
    (state: RootState, shiftIds: string[], queryParameter: string) =>
      shiftsApiSlice.endpoints.getShifts.select(queryParameter)(state).data ??
      initialState,
    (_: RootState, shiftIds: string[], houseId: string, userId: string) => {
      return { shiftIds, userId }
    },
    (data, { shiftIds, userId }) => {
      if (data.entities && data.ids) {
        return data.ids.filter((id) => {
          if (shiftIds.includes(id as string)) {
            const shift = data.entities[id]
            if (shift?.assignedUser === userId) {
              return true
            } else {
              return false
            }
          }
        })
      }
    }
  )
}
