import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from './ShiftInfoHeader'
import SelectedUserComponent from './SelectedUserComponent'
import AvailableUsersTable from './AvailableUsersTableV2'
import { Days, House, User } from '@/types/schema'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'

export const ShiftAssignmentCard = ({
  shiftId,
  selectedDay,
  handleClose,
  handleEditShift,
  open,
}: {
  shiftId?: EntityId
  selectedDay: string
  handleClose: () => void
  handleEditShift?: (shiftId: string) => void
  open: boolean
}) => {
  const authUser = useSelector(selectCurrentUser)
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: userData } = useGetUsersQuery(authHouse?.id)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dayFilter, setDayFilter] = useState<Days>('All')
  const [assignedUserId, setAssignedUserID] = useState<EntityId>('')
  const [unselect, setUnselect] = useState<boolean>(false)
  const [filteredUserIds, setFilteredUserIds] = useState<EntityId[]>([])

  const handleAssignedUserId = (userId: EntityId) => {
    // console.log(userId)
    setAssignedUserID(userId)
    setUnselect(false)
  }

  const handleUnassignedUserId = () => {
    setUnselect(true)
  }

  useEffect(() => {
    //** Verify that user data exist and the ids and entities parameter is define */
    if (userData && userData.ids && userData.entities) {
      let filteredIds = userData.ids
      setFilteredUserIds(filteredIds)
    }
  }, [userData])

  let content = null
  if (open) {
    content = (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleClose}
          className="dialog"
        >
          <DialogTitle>
            <ShiftInfoHeader
              shiftId={shiftId}
              selectedDay={selectedDay}
              handleClose={handleClose}
            />
          </DialogTitle>
          <DialogContent>
            <SelectedUserComponent
              userId={assignedUserId}
              handleClick={handleUnassignedUserId}
            />
            {userData ? (
              <AvailableUsersTable
                day={selectedDay}
                houseID={authHouse.id}
                shiftID={shiftId as string}
                handleAssignedUserId={handleAssignedUserId}
                handleEditShift={handleEditShift}
                handleClose={handleClose}
                unselect={unselect}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // console.log('ASSIGNED USER: ' + assignedUserId)
  return content
}
