import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { House, Shift, User } from '@/types/schema'
import { Box, Stack } from '@mui/material'
import React, { FormEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PersonalScheduledShiftsTable from './PersonalScheduledShiftsTable'
import { EntityId } from '@reduxjs/toolkit'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'

const MemberIndividualTabContent = () => {
  const authUser = useSelector(selectCurrentUser) as User
  const currentHouse = useSelector(selectCurrentHouse) as House

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredShiftIDs, setFilteredShiftIDs] = useState<EntityId[]>()

  const { data: ScheduledShiftsData } = useGetScheduledShiftsQuery(
    currentHouse.houseID
  )
  const { data: shifts } = useGetShiftsQuery(currentHouse.houseID)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
  }

  const handleFiltering = () => {
    if (ScheduledShiftsData) {
      let filteredCopy = [...ScheduledShiftsData.ids]
      let scheduled = authUser?.assignedScheduledShifts
      if (scheduled) {
        filteredCopy = filteredCopy.filter((id) => {
          return scheduled.includes(String(id))
        })
      }
      if (searchQuery !== '') {
        filteredCopy = filteredCopy.filter((id) => {
          const scheduledShift = ScheduledShiftsData.entities[id]
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
      console.log('filteredcopy', filteredCopy)
      setFilteredShiftIDs(filteredCopy)
    }
  }

  useEffect(() => {
    handleFiltering()
  }, [ScheduledShiftsData, searchQuery])

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
      </Stack>
      {ScheduledShiftsData && filteredShiftIDs ? (
        <PersonalScheduledShiftsTable
          scheduledShiftIds={filteredShiftIDs}
          scheduledShiftDictionary={ScheduledShiftsData.entities}
        />
      ) : null}
    </React.Fragment>
  )
}

export default MemberIndividualTabContent
