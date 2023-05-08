import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { ScheduledShift } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState } from '../../store/store'

const scheduledShiftsAdapter = createEntityAdapter<ScheduledShift>({})

const initialState = scheduledShiftsAdapter.getInitialState()

export const scheduledShiftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScheduledShifts: builder.query({
      query: (houseId: string) => ({
        url: `houses/${houseId}/scheduledShifts`,
        method: 'GET',
        params: { queryType: 'scheduledshifts' },
      }),
      transformResponse: (responseData: ScheduledShift[]) => {
        const loadedShifts = responseData.map((entity) => {
          entity.id = entity.id
          return entity
        })
        // console.log(loadedShifts)
        return scheduledShiftsAdapter.setAll(initialState, loadedShifts)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'ScheduledShift', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'ScheduledShift' as const,
              id,
            })),
          ]
        } else return [{ type: 'ScheduledShift', id: 'LIST' }]
      },
    }),
    addNewScheduledShift: builder.mutation({
      query: (data: { houseId: string; data: Partial<ScheduledShift> }) => ({
        url: `houses/${data.houseId}/scheduledShifts`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'ScheduledShift', id: 'LIST' }],
    }),
    addNewScheduledShiftBatch: builder.mutation({
      query: (data: { houseId: string; data: ScheduledShift[] }) => ({
        url: `houses/${data.houseId}/scheduledShifts`,
        method: 'POST',
        params: { batch: data.data },
      }),
      invalidatesTags: [{ type: 'ScheduledShift', id: 'LIST' }],
    }),
    updateScheduledShift: builder.mutation({
      query: (data: {
        houseId: string
        shiftId: string
        data: Partial<ScheduledShift>
      }) => ({
        url: `houses/${data.houseId}/scheduledShifts/${data.shiftId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ScheduledShift', id: arg.shiftId },
      ],
    }),
  }),
})

export const {
  useGetScheduledShiftsQuery,
  useAddNewScheduledShiftMutation,
  useUpdateScheduledShiftMutation,
  useAddNewScheduledShiftBatchMutation,
} = scheduledShiftsApiSlice

// Creates memoized selector to get normalized state based on the query parameter
const selectScheduledShiftsData = createSelector(
  (state: RootState, queryParameter: string) =>
    scheduledShiftsApiSlice.endpoints.getScheduledShifts.select(queryParameter)(
      state
    ),
  (scheduledShiftsResult) => scheduledShiftsResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectScheduledShiftById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectScheduledShiftsData(state, queryParameter),
    (_: unknown, scheduledShiftId: EntityId) => scheduledShiftId,
    (
      data: { entities: { [x: string]: unknown } },
      scheduledShiftId: string | number
    ) => data.entities[scheduledShiftId]
  )
