import React, { useState } from 'react'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Unstable_Grid2'
import { Shift, User } from '@/types/schema'
import { HeadCell } from '@/interfaces/interfaces'
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '@/features/user/userApiSlice'
import {
  selectShiftById,
  useUpdateShiftMutation,
} from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import SortedTable from '@/components/shared/tables/SortedTable'

// waiting on sorted table to only allow selecting 1 checkbox at a time
// pass in something that's been selected
// somehow need to refetch on update

type AvailableUsersTableProps = {
  day: string
  houseID: string
  shiftID: string
  unselect: boolean
  handleAssignedUserId: (userId: string) => void
  handleClose: () => void
  handleEditShift?: (shiftId: string) => void
}

const displayNameFn = (user: User) => {
  if (!user) {
    return ''
  }
  if (user.displayName) {
    return user.displayName
  }
  return user.firstName + ' ' + user.lastName
}

const hoursAssignedFn = (user: User) => {
  if (!user) {
    return 0
  }
  return 5 - user.hoursAssigned
}
const preferenceFn = (user: User, hoursRequired: string | number) => {
  const h = (hoursRequired as number) - user.hoursAssigned
  return h.toString()
}

const headCells: HeadCell<User>[] = [
  {
    id: 'displayName',
    isNumeric: false,
    label: 'Available Users',
    isSortable: false,
    align: 'left',
    transformFn: displayNameFn,
  },
  {
    id: 'hoursAssigned',
    isNumeric: true,
    label: 'Hours Needed',
    isSortable: true,
    align: 'left',
    transformFn: hoursAssignedFn,
  },
]

/**
 * A modal that appears when a manager wants to assign people/unassign people from a shift.
 * Matches people to shifts based on availabilities.
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 * Contains a ShiftAssignmentTable.
 *
 * @param day - The day that is selected when the manager is going through shifts on a day-by-day view
 * @param houseID - The ID of the house that the manager manages
 * @param shiftID - The ID of the shift that the manager has selected.
 * @returns AvailableUsersTable
 */
const AvailableUsersTable: React.FC<AvailableUsersTableProps> = ({
  day,
  houseID,
  shiftID,
  handleAssignedUserId,
  handleEditShift,
  handleClose,
  unselect,
}: AvailableUsersTableProps) => {
  // TODO:
  // - handle close
  // - set the selected user to be the assigned user if there exists one
  // - handle the selected and deselected user
  // - disable the table when a user is selected/assigned
  // - update the user and shift objects when a user is assigned/unassigned

  // Stores the shiftObject of the give shift
  const shiftObject = useSelector(
    (state: RootState) =>
      selectShiftById(houseID)(state, shiftID as EntityId) as Shift
  )

  // define state variables
  const [listOfUserIds, setLitsOfUserIds] = useState<EntityId[]>([])
  const [selectedUserId, setSelectedUserId] = useState(shiftObject.assignedUser)
  const [disableTable, setDisableTable] = useState(
    selectedUserId ? true : false
  )

  const oringalAssignedUser = shiftObject.assignedUser

  // Define the user queries
  const {
    data: usersData,
    // isLoading: isUsersLoading,
    isSuccess: isUsersDataSuccess,
    // isError: isUsersError,
  } = useGetUsersQuery({ houseID })

  const [
    updateShift,
    {
      // isLoading: isLoadingUpdateShift,
      isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const [
    updateUser,
    {
      // isLoading: isLoadingUpdateShift,
      isSuccess: isSuccessUpdateUser,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateUserMutation()

  const handleSelectUser = (event: React.MouseEvent<unknown>, id: EntityId) => {
    setSelectedUserId(id as string)
    setDisableTable(true)
  }

  const handleDeselectUser = () => {
    setSelectedUserId('')
    setDisableTable(false)
  }

  useEffect(() => {
    // would filter the userIds here, but not doing any filtering or sorting right now
    if (isUsersDataSuccess && usersData) {
      let userIds = usersData.ids
      setLitsOfUserIds(userIds)
    }
  }, [isUsersDataSuccess, usersData])

  useEffect(() => {
    if (unselect) {
      handleDeselectUser()
    }
  }, [unselect])

  return (
    <React.Fragment>
      <SortedTable
        ids={listOfUserIds}
        entities={
          usersData?.entities as Dictionary<
            User & { [key in keyof User]: string | number }
          >
        }
        headCells={headCells}
        isCheckable={false}
        isSortable={false}
        disable={disableTable}
        handleRowClick={handleSelectUser}
      />
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid smOffset={9}>
          {!selectedUserId && !shiftObject.assignedUser ? (
            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                handleEditShift ? handleEditShift(shiftID) : null
              }
            >
              Edit Shift
            </Button>
          ) : null}
        </Grid>
        {/* <Grid xs /> */}
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => console.log('HELLO GREGY')}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default AvailableUsersTable
