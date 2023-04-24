import React, { useState } from 'react'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Unstable_Grid2'
import { House, Shift, User } from '@/types/schema'
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
import { selectSelectedUserId, setSelectedUserId } from '../userAssignmentSlice'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { createListOfUsersForShift } from '@/sprintFiles/availabilityHelper'

type AvailableUsersTableProps = {
  day: string
  houseID: string
  shiftID: string
  handleClose: () => void
  handleEditShift?: (shiftId: string) => void
}

const displayNameFn = (user: User) => {
  // if (!user) {
  //   return ''
  // }
  // if (user.preferredName) {
  //   return user.preferredName
  // }
  return user.preferredName ? user.preferredName : user.displayName
}

const hoursNeededFn = (user: User) => {
  if (!user) {
    return 0
  } else if (!user.hoursAssigned) {
    return 5
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
  },
  {
    id: 'hoursAssigned',
    isNumeric: true,
    label: 'Hours Needed',
    isSortable: true,
    align: 'left',
    transformFn: hoursNeededFn,
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
  handleEditShift,
  handleClose,
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

  // shiftObject.hours = shiftObject.hours as number

  const selectedUserId = useSelector(selectSelectedUserId)
  const dispatch = useDispatch()

  // define state variables
  const authHouse = useSelector(selectCurrentHouse) as House
  const [listOfUserIds, setLitsOfUserIds] = useState<EntityId[]>([])
  const [disableTable, setDisableTable] = useState(
    selectedUserId ? true : false
  )

  const originalAssignedUser = shiftObject.assignedUser

  useEffect(() => {
    dispatch(
      setSelectedUserId({ selectedUserId: originalAssignedUser as string })
    )
  }, [])

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
    if (!disableTable) {
      dispatch(setSelectedUserId({ selectedUserId: id as string }))
    }
  }

  useEffect(() => {
    // would filter the userIds here, but not doing any filtering or sorting right now
    if (isUsersDataSuccess && usersData) {
      let days = []
      if (day === 'All') {
        days = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]
      } else {
        days = [day]
      }
      let userIds = createListOfUsersForShift(shiftObject, usersData, days)
      setLitsOfUserIds(userIds)
    }
  }, [day, isUsersDataSuccess, shiftObject, usersData])

  useEffect(() => {
    if (selectedUserId) {
      setDisableTable(true)
    } else {
      setDisableTable(false)
    }
  }, [selectedUserId])

  const assignSelectedUser = () => {
    const userObject = usersData?.entities[selectedUserId]
    const shiftData = {
      data: { assignedUser: selectedUserId, assignedDay: day },
      houseId: authHouse.houseID,
      shiftId: shiftObject.id,
    }
    // console.log("USER'S HOURS ASSIGNED: ", userObject?.hoursAssigned)
    // console.log('SHIFTS HOURS: ', shiftObject.hours as number)
    const userData = {
      data: {
        hoursAssigned:
          userObject && userObject.hoursAssigned
            ? userObject.hoursAssigned + shiftObject.hours
            : (shiftObject.hours as number),
      },
      userId: selectedUserId,
    }
    // console.log('NUMBER OF HOURS ASSIGNED', userData.data.hoursAssigned)
    updateShift(shiftData)
    updateUser(userData)
  }

  const unassignOriginalUser = () => {
    const userObject = usersData?.entities[originalAssignedUser]
    const shiftData = {
      data: { assignedUser: '', assignedDay: '' },
      houseId: authHouse.houseID,
      shiftId: shiftObject.id,
    }
    const userData = {
      data: {
        hoursAssigned: userObject
          ? userObject.hoursAssigned - (shiftObject.hours as number)
          : 0,
      },
      userId: originalAssignedUser,
    }
    updateShift(shiftData)
    updateUser(userData)
  }

  const handleSubmit = () => {
    if (!originalAssignedUser && selectedUserId) {
      assignSelectedUser()
    } else if (!originalAssignedUser && !selectedUserId) {
      // do nothing
      console.log('nada')
    } else if (originalAssignedUser && selectedUserId) {
      if (originalAssignedUser === selectedUserId) {
        // do nothing
        console.log('nada')
      } else {
        unassignOriginalUser()
        assignSelectedUser()
      }
    } else if (originalAssignedUser && !selectedUserId) {
      unassignOriginalUser()
    }
    handleClose()
  }

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
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default AvailableUsersTable
