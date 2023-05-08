import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { ScheduledShift } from '../../types/schema'
import { apiSlice } from '../../store/api/apiSlice'
import { RootState } from '../../store/store'

const publishScheduleAdapter = createEntityAdapter<ScheduledShift>({})
