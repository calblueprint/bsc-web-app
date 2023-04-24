import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from './ShiftInfoHeader'
import SelectedUserComponent from './SelectedUserComponent'
import AvailableUsersTable from './AvailableUsersTableV2'
import { Days, House } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import { selectSelectedUserId, setSelectedUserId } from './userAssignmentSlice'

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
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: userData } = useGetUsersQuery(authHouse?.id)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dayFilter, setDayFilter] = useState<Days>('All')
  // const [selectedUserId, setSelectedUserID] = useState<EntityId>('')
  // const [unselect, setUnselect] = useState<boolean>(false)
  const [filteredUserIds, setFilteredUserIds] = useState<EntityId[]>([])

  const dispatch = useDispatch()

  const handleSelectedUserId = (userId: EntityId) => {
    // console.log(userId)
    dispatch(setSelectedUserId({ selectedUserId: userId }))
    // setSelectedUserID(userId)
    // setUnselect(false)
  }

  const handleUnselectedUserId = () => {
    dispatch(setSelectedUserId({ selectedUserId: '' }))
    // setSelectedUserID('')
    // setUnselect(true)
  }

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
            <SelectedUserComponent handleClick={handleUnselectedUserId} />
            {userData ? (
              <AvailableUsersTable
                day={selectedDay}
                houseID={authHouse.id}
                shiftID={shiftId as string}
                handleSelectedUserId={handleSelectedUserId}
                handleEditShift={handleEditShift}
                handleClose={handleClose}
                // unselect={unselect}
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
