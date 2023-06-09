import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { Days, House, ScheduledShift, Shift } from '@/types/schema'
import React, { useState, FormEvent, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AllScheduledShiftsTable from '@/features/scheduledShift/tables/AllScheduledShiftsTable'
import { Box, Grid, Stack } from '@mui/material'
import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterShiftByDayBtn from '@/features/shift/buttons/FilterShiftByDayBtn'
import NewShiftBtn from '@/features/shift/buttons/NewShiftBtn'
import { EntityId } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'

import { selectWeeklyScheduleShiftsByWeekNumber } from '@/features/scheduledShift/scheduledShiftSlice'

import { RootState } from '@/store/store'

const filterOptions: Days[] = [
  'All',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/**
 *
 * @returns Renders the page for all of the shifts in the house (allows for filtering by day, category and shift name)
 */
const ManagerAllShiftsTabContent = () => {
  const currentHouse: House = useSelector(selectCurrentHouse) as House

  const weekScheduledShifts: string[] = useSelector(
    selectWeeklyScheduleShiftsByWeekNumber
  )
  // Stores the search query
  const [searchQuery, setSearchQuery] = useState<string>('')
  // Stores the day filter
  const [dayFilter, setDayFilter] = useState<Days>('All')
  // The ids that are passed into the AllScheduledShifts Table to display
  const [filteredShiftIDs, setFilteredShiftIDs] =
    useState<string[]>(weekScheduledShifts)

  const [dayFilteredIDs, setDayFilteredIDs] = useState<EntityId[]>([])

  const [finalFilteredIDs, setFinalFilteredIDs] = useState<EntityId[]>([])

  const [scheduleShiftsObj, setScheduleShiftObj] =
    useState<(ScheduledShift | undefined)[]>()

  const { data: scheduledShifts } = useGetScheduledShiftsQuery(
    currentHouse.houseID
  )

  const { data: shifts } = useGetShiftsQuery(currentHouse.houseID)

  const handleSearchChange = (value: string) => {
    // console.log('search: ' + value)
    setSearchQuery(value)
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    // console.log('Search query:', searchQuery)
  }

  const handleFilterChange = (selectedFilter: Days) => {
    // console.log('Selected filter:', selectedFilter)
    setDayFilter(selectedFilter)
  }

  const handleSelectedWeek = (weekNumber: number) => {
    console.log('Selected week:', weekNumber)
  }

  /**
   * @returns Filters based on the day filter and search filter and sets the filteredShiftID
   */
  const handleFiltering = () => {}

  useEffect(() => {
    // console.log('filtering finalFilter')
    if (scheduledShifts && shifts) {
      let filteredCopy = [...dayFilteredIDs]
      if (searchQuery !== '') {
        filteredCopy = filteredCopy.filter((id) => {
          const scheduledShift = scheduledShifts.entities[id]
          if (scheduledShift) {
            // DO NAME FILTERING, WILL PROBABLY HAVE TO FETCH NAME FROM INNER SHIFT OBJECT LIKE IN ALLSSCHEDULED SHIFTS
            let shiftCopy: Shift | undefined = undefined
            if ('shiftCopy' in scheduledShift) {
              shiftCopy = scheduledShift['shiftCopy'] as Shift
            } else {
              let innerShiftID = scheduledShift.shiftID
              if (shifts === undefined) {
                return false
              }
              shiftCopy = shifts.entities[innerShiftID] as Shift
            }
            if (shiftCopy === undefined) {
              return false
            }
            return (
              shiftCopy.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shiftCopy.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          }
        })
      }
      setFinalFilteredIDs(filteredCopy)
    }
  }, [dayFilteredIDs, scheduledShifts, shifts, searchQuery])

  useEffect(() => {
    // console.log('filtering shiftIds')
    if (scheduledShifts && shifts) {
      let filteredCopy = [...filteredShiftIDs]
      if (dayFilter !== 'All') {
        filteredCopy = filteredCopy.filter((id) => {
          const scheduledShift = scheduledShifts.entities[id]
          if (scheduledShift) {
            let shiftCopy: Shift | undefined = undefined
            if ('shiftCopy' in scheduledShift) {
              shiftCopy = scheduledShift['shiftCopy'] as Shift
            } else {
              let innerShiftID = scheduledShift.shiftID
              if (shifts === undefined) {
                return false
              }
              shiftCopy = shifts.entities[innerShiftID] as Shift
            }
            if (shiftCopy === undefined) {
              return false
            }
            return (
              shiftCopy.assignedDay.toLowerCase() === dayFilter.toLowerCase()
            )
          }
          return false
        })
      }

      setDayFilteredIDs(filteredCopy)
    }
  }, [filteredShiftIDs, scheduledShifts, shifts, dayFilter])

  useEffect(() => {
    // console.log('filtering firstFilter')
    if (weekScheduledShifts) {
      setFilteredShiftIDs(weekScheduledShifts)
    }
  }, [weekScheduledShifts])

  // useEffect(() => {
  //   if (scheduledShifts) {
  //     const shifts = scheduledShifts.ids.map(
  //       (shiftId) => scheduledShifts.entities[shiftId]
  //     )
  //     setScheduleShiftObj(shifts)
  //   }
  // }, [scheduledShifts])

  return (
    <React.Fragment>
      <Stack direction={'row'}>
        <Box sx={{ flexGrow: 3 }}>
          <FilterSearchBar
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />
        </Box>
        {/* <Box sx={{ flexGrow: 1 }} /> */}

        {/* <Box sx={{ flexGrow: 1 }} /> */}
        <Box sx={{ flexGrow: 1, marginX: 2, marginBottom: 2 }}>
          <FilterShiftByDayBtn
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </Box>
        {/* <Box sx={{ flexGrow: 2 }}>
          <QuickShiftButton />
        </Box> */}
      </Stack>
      {scheduledShifts && finalFilteredIDs && (
        <AllScheduledShiftsTable
          scheduledShiftIDs={finalFilteredIDs}
          scheduledShiftDictionary={scheduledShifts.entities}
        />
      )}
    </React.Fragment>
  )
}

export default ManagerAllShiftsTabContent
