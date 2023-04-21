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
  const [selectedUserId, setSelectedUserID] = useState<EntityId>('')
  const [unselect, setUnselect] = useState<boolean>(false)
  const [filteredUserIds, setFilteredUserIds] = useState<EntityId[]>([])

  const handleSelectedUserId = (userId: EntityId) => {
    // console.log(userId)
    setSelectedUserID(userId)
    setUnselect(false)
  }

  const handleUnselectedUserId = () => {
    setSelectedUserID('')
    setUnselect(true)
  }

  useEffect(() => {
    if (unselect) {
      handleUnselectedUserId()
    }
  }, [unselect])

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
              userId={selectedUserId}
              handleClick={handleUnselectedUserId}
            />
            {userData ? (
              <AvailableUsersTable
                day={selectedDay}
                houseID={authHouse.id}
                shiftID={shiftId as string}
                handleSelectedUserId={handleSelectedUserId}
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

  // console.log('SELECTED USER: ' + selectedUserId)
  return content
}
