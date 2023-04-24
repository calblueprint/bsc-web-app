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
import { useDispatch, useSelector } from 'react-redux'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { EntityId } from '@reduxjs/toolkit'
import { Days, House } from '@/types/schema'
import { ShiftAssignmentCard } from '@/features/userAssignment/cards/ShiftAssignmentCard'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'
import { setSelectedUserId } from '@/features/userAssignment/userAssignmentSlice'

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

const ManagerUnassignedTabContent = () => {
  const authUser = useSelector(selectCurrentUser)
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: shiftData } = useGetShiftsQuery(authHouse.id)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dayFilter, setDayFilter] = useState<Days>('All')
  const [filteredShiftIds, setFilteredShiftIds] = useState<EntityId[]>([])

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [selectedShiftId, setSelectedShiftId] = useState<EntityId>()
  //** end Modal stuff */

  const [openEditShift, setOpenEditShift] = useState<boolean>(false)
  const [editShiftId, setEditShiftId] = useState<string>('')
  const dispatch = useDispatch()

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

  const handleEditShift = (shiftId: string) => {
    setEditShiftId(shiftId)
    setOpenEditShift(true)
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(setSelectedUserId({ selectedUserId: '' }))
  }

  const handleOpen = () => {
    setOpen(true)
  }

  //** this function handles passing the info from selected item from table to the modal that pops open */
  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    shiftId: EntityId
  ) => {
    // console.log('event: ', event, 'shift: ', shiftId)
    setSelectedShiftId(shiftId)
    handleOpen()
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
          handleRowClick={handleRowClick}
        />
      ) : null}
      <ShiftAssignmentCard
        shiftId={selectedShiftId}
        selectedDay={dayFilter}
        handleClose={handleClose}
        handleEditShift={handleEditShift}
        open={open}
      />
      <EditShiftCard
        shiftId={editShiftId}
        setOpen={setOpenEditShift}
        open={openEditShift}
      />
    </React.Fragment>
  )
}

export default ManagerUnassignedTabContent
