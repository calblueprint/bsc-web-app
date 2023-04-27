import { Box, InputAdornment, Stack, TextField } from '@mui/material'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { FormEvent, useEffect, useState } from 'react'
import EditUserCard from '@/features/user/cards/EditUserCard'
import SortedTable from '@/components/shared/tables/SortedTable'
import { HeadCell } from '@/interfaces/interfaces'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import { User } from '@/types/schema'
import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'

const headCells: HeadCell<User & { [key in keyof User]: string | number }>[] = [
  {
    id: 'displayName',
    isNumeric: false,
    label: 'Member Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'weekMissedHours',
    isNumeric: true,
    label: 'Missed Hours',
    isSortable: false,
    align: 'left',
  },
  {
    id: 'weekPenaltyHours',
    isNumeric: true,
    label: 'Penalty Hours',
    isSortable: false,
    align: 'left',
  },
  {
    id: 'email',
    isNumeric: false,
    label: 'Email',
    isSortable: false,
    align: 'left',
  },
]

export const MembersTableContent = () => {
  const { data, isLoading, isSuccess, isError } = useGetUsersQuery({})

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [modalMemberID, setModalMemberID] = useState<string>()
  //** end Modal stuff */

  const [members, setMembers] = useState<EntityId[] | undefined>([])
  const [filterBy, setFilterBy] = useState<string>('')
  const [displayMembers, setDisplayMembers] = useState<EntityId[] | undefined>(
    members
  )
  const isIn = (memberID: EntityId) => {
    return data?.entities[memberID]?.displayName
      ?.toLowerCase()
      .includes(filterBy.toLowerCase())
  }

  const isMember = (memberID: EntityId) => {
    return data?.entities[memberID]?.roles.includes('member')
  }

  const resetDisplayMembers = () => {
    if (members) {
      setDisplayMembers(members.filter(isMember))
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    memberID: EntityId
  ) => {
    const member = data?.entities[memberID]
    setModalMemberID(member?.id)
    handleOpen()
  }
  const handleSearchChange = (value: string) => {
    setFilterBy(value)
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
  }

  useEffect(() => {
    if (isSuccess && data) {
      setMembers(data.ids)
      setDisplayMembers(data.ids)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (members) {
      resetDisplayMembers()
    }
  }, [members])

  useEffect(() => {
    if (filterBy.length > 0) {
      setDisplayMembers(members?.filter(isIn))
    } else {
      resetDisplayMembers()
    }
  }, [filterBy])
  if (isLoading) {
    return <div>Loading...</div>
  } else if (isError) {
    return <div>Error</div>
  } else {
    return (
      <>
        <Box sx={{ marginBottom: 2 }}>
          <FilterSearchBar
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />
        </Box>
        <SortedTable
          ids={displayMembers as EntityId[]}
          entities={
            data?.entities as Dictionary<
              User & { [key in keyof User]: string | number }
            >
          }
          headCells={headCells}
          isCheckable={false}
          isSortable={false}
          handleRowClick={handleRowClick}
        />
        <EditUserCard
          userId={modalMemberID}
          open={open}
          setOpen={setOpen}
          editType="Information"
        />
      </>
    )
  }
}
