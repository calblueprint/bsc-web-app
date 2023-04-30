import { Box, DialogTitle, Stack, Typography } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import Grid from '@mui/material/Unstable_Grid2'
import { House, Shift } from '@/types/schema'
import CloseButton from '../buttons/CloseButton'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import CloseIcon from '@mui/icons-material/Close'
import {
  shiftAssignBuffer,
  shiftAssignInfo,
  shiftAssignTitle,
} from '@/assets/StyleGuide'

const ShiftInfoHeader = ({
  shiftId,
  selectedDay,
  handleClose,
}: {
  shiftId?: EntityId
  selectedDay: string
  handleClose: () => void
}) => {
  const authHouse = useSelector(selectCurrentHouse) as House

  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById(authHouse.houseID)(state, shiftId as EntityId) as Shift
  )
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <DialogTitle variant="h4" component="h2">
          {shift.name}
        </DialogTitle>
        <CloseIcon fontSize="large" onClick={handleClose} />
      </Box>
      <Stack direction={'row'} sx={{ marginLeft: '3%', marginBottom: '1%' }}>
        <Typography sx={shiftAssignTitle}>Worth</Typography>
        <Typography sx={shiftAssignInfo}>
          {shift.hours}
          {shift.hours < 2 ? ' hour' : ' hours'}
        </Typography>
        <Typography sx={shiftAssignTitle}>Window</Typography>
        <Typography sx={shiftAssignInfo}>
          {selectedDay[0].toUpperCase() + selectedDay.slice(1)}{' '}
          {shift.timeWindowDisplay}
        </Typography>
        <Typography sx={shiftAssignBuffer}>
          {shift.verificationBuffer} hour buffer
        </Typography>
      </Stack>
      <Stack direction={'row'} sx={{ marginLeft: '3%' }}>
        <Typography sx={shiftAssignTitle}>Assigned</Typography>
        <Typography sx={shiftAssignInfo}>
          {shift.assignedUser == null ? '0 members' : '1 member'}
        </Typography>
        <Typography sx={shiftAssignTitle}>Variants</Typography>
        <Typography sx={shiftAssignInfo}>
          {shift.possibleDays.join(', ')}
        </Typography>
      </Stack>
    </Box>
  )
}
export default ShiftInfoHeader
