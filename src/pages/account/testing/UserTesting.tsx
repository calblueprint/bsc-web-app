/** This file was copied and pasted into ManagerUnassignedTabContent.tsx */

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import NewShiftBtn from '@/features/shift/buttons/NewShiftBtn'
import UnassignedShiftsTable from '@/features/shift/tables/UnassignedShiftsTable'
import PrimarySearchAppBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterShiftByDayBtn from '@/features/shift/buttons/FilterShiftByDayBtn'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { EntityId } from '@reduxjs/toolkit'
import { Days, House } from '@/types/schema'
import SampleUserAvailability from '@/features/user/testing/SampleUserAvailability'

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

const UserTesting = () => {
  const authUser = useSelector(selectCurrentUser)
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: shiftData } = useGetShiftsQuery(authHouse.id)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dayFilter, setDayFilter] = useState<Days>('All')
  const [filteredShiftIds, setFilteredShiftIds] = useState<EntityId[]>([])

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

  useEffect(() => {
    //** Verify that shift data exist and the ids and entities parameter is define */
    if (shiftData && shiftData.ids && shiftData.entities) {
      let filter = shiftData.ids
      if (dayFilter !== 'All') {
        filter = filter.filter((id) => {
          const shift = shiftData.entities[id]
          if (shift) {
            const { possibleDays } = shift
            return possibleDays?.some(
              (day) => day.toLowerCase() === dayFilter.toLowerCase()
            )
          }
        })
      }
      if (searchQuery) {
        filter = filter.filter((id) => {
          const shift = shiftData.entities[id]
          if (shift) {
            const { name, category } = shift
            // console.log(
            //     'name: ' + name,
            //     ' category: ',
            //     category,
            //     ' seachQuery: ' + searchQuery
            // )
            return (
              name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              category?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          }
        })
      }
      setFilteredShiftIds(filter)
    }
  }, [shiftData, dayFilter, searchQuery])

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
        <Box sx={{ flexGrow: 2 }}>
          <NewShiftBtn />
        </Box>
      </Stack>
      {shiftData ? (
        <UnassignedShiftsTable
          shiftIds={filteredShiftIds}
          shiftEntities={shiftData?.entities}
        />
      ) : null}

      <SampleUserAvailability />
    </React.Fragment>
  )
}

export default UserTesting
