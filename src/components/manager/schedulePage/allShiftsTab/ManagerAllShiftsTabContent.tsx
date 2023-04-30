import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { Days, House, Shift } from '@/types/schema'
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
  // Stores the search query
  const [searchQuery, setSearchQuery] = useState<string>('')
  // Stores the day filter
  const [dayFilter, setDayFilter] = useState<Days>('All')
  // The ids that are passed into the AllScheduledShifts Table to display
  const [filteredShiftIDs, setFilteredShiftIDs] = useState<EntityId[]>()

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
    console.log('Search query:', searchQuery)
  }

  const handleFilterChange = (selectedFilter: Days) => {
    console.log('Selected filter:', selectedFilter)
    setDayFilter(selectedFilter)
  }

  /**
   * @returns Filters based on the day filter and search filter and sets the filteredShiftID
   */
  const handleFiltering = () => {
    if (scheduledShifts) {
      let filteredCopy = [...scheduledShifts.ids]
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
      setFilteredShiftIDs(filteredCopy)
    }
  }

  useEffect(() => {
    handleFiltering()
  }, [scheduledShifts, dayFilter, searchQuery])

  return (
    <React.Fragment>
      <Stack direction={'row'}>
        <Box sx={{ flexGrow: 3 }}>
          <FilterSearchBar
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
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
      {scheduledShifts && filteredShiftIDs && (
        <AllScheduledShiftsTable
          scheduledShiftIDs={filteredShiftIDs}
          scheduledShiftDictionary={scheduledShifts.entities}
        />
      )}
    </React.Fragment>
  )
}

export default ManagerAllShiftsTabContent
