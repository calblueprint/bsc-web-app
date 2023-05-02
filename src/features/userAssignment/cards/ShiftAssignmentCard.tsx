import { useEffect, useState } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from '@/components/shared/shiftCardHeader/ShiftInfoHeader'
import SelectedUserComponent from '../SelectedUserComponent'
import AvailableUsersTable from '../tables/AvailableUsersTable'
import { Days, House, Shift } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import { selectSelectedUserId, setSelectedUserId } from '../userAssignmentSlice'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import CloseIcon from '@mui/icons-material/Close'

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

  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById()(state, shiftId as EntityId, authHouse.houseID) as Shift
  )

  let content = null
  if (shift) {
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
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              textTransform={'capitalize'}
            >
              {shift.name}

              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <ShiftInfoHeader
              shiftId={shiftId}
              selectedDay={selectedDay}
              handleClose={handleClose}
            />
            <SelectedUserComponent />
            {userData ? (
              <AvailableUsersTable
                day={selectedDay}
                houseID={authHouse.id}
                shiftID={shiftId as string}
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
