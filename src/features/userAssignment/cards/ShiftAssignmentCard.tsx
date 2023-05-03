import { useEffect, useState } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from '@/components/shared/shiftCardHeader/ShiftInfoHeader'
import SelectedUserComponent from '../SelectedUserComponent'
import AvailableUsersTable from '../tables/AvailableUsersTable'
import { Days, House, Shift } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'

import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import CloseIcon from '@mui/icons-material/Close'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'

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

  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById()(state, shiftId as EntityId, authHouse.houseID) as Shift
  )

  const [openEditShift, setOpenEditShift] = useState(false)

  const handleEditShift1 = () => {
    setOpenEditShift(true)
  }

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
              alignItems={'center'}
              textTransform={'capitalize'}
            >
              <Typography variant="h4">{shift.name}</Typography>

              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleClose}
                sx={{ marginLeft: 'auto' }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <ShiftInfoHeader
              shiftId={shiftId}
              selectedDay={selectedDay}
              handleClose={handleClose}
            />
            <Divider sx={{ marginY: 1 }} />

            <SelectedUserComponent />
            <Divider sx={{ marginY: 1 }} />

            {userData ? (
              <AvailableUsersTable
                day={selectedDay}
                houseID={authHouse.id}
                shiftID={shiftId as string}
                handleEditShift={handleEditShift1}
                handleClose={handleClose}
              />
            ) : null}
          </DialogContent>
          <EditShiftCard
            shiftId={shiftId as string}
            setOpen={setOpenEditShift}
            open={openEditShift}
          />
        </Dialog>
      </>
    )
  }

  // console.log('SELECTED USER: ' + selectedUserId)
  return content
}
