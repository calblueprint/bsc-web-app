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
import { capitalizeFirstLetter } from '@/utils/utils'

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

  // const shift: Shift = useSelector(
  //   (state: RootState) =>
  //     selectShiftById(authHouse.houseID)(state, shiftId as EntityId) as Shift
  // )
  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById()(state, shiftId as EntityId, authHouse.houseID) as Shift
  )
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <DialogTitle variant="h4" component="h2" textTransform={'capitalize'}>
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
        <Typography sx={shiftAssignInfo} textTransform={'capitalize'}>
          {capitalizeFirstLetter(selectedDay)} {shift.timeWindowDisplay}
        </Typography>
        <Typography sx={shiftAssignBuffer}>
          {shift.verificationBuffer} hour buffer
        </Typography>
      </Stack>
      <Stack direction={'row'} sx={{ marginLeft: '3%' }}>
        <Typography sx={shiftAssignTitle}>Assigned</Typography>
        <Typography sx={shiftAssignInfo} textTransform={'capitalize'}>
          {shift.assignedUser == null ? '0 members' : '1 member'}
        </Typography>
        <Typography sx={shiftAssignTitle}>Variants</Typography>
        <Typography sx={shiftAssignInfo} textTransform={'capitalize'}>
          {shift.possibleDays.join(', ')}
        </Typography>
      </Stack>

      {/* <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid xs={'auto'} md={'auto'} lg={'auto'} textTransform={'capitalize'}>
          <h1>{shift.name}</h1>
        </Grid>
        
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          <CloseButton handleClick={handleClose} />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid container xs={'auto'} md={'auto'} lg={'auto'} spacing={2}>
          <Grid xs={'auto'} lg={'auto'}>
            <Typography fontFamily={'Inter'} color={'#ACACAC'}>
              Worth
            </Typography>
          </Grid>
          <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
            <Typography>
              {shift.hours} {shift.hours < 2 ? 'hour' : 'hours'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={'auto'} md={'auto'} lg={'auto'} spacing={2}>
          <Grid xs={'auto'} lg={'auto'}>
            <Typography fontFamily={'Inter'} color={'#ACACAC'}>
              Window
            </Typography>
          </Grid>
          <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
            <Typography>
              {capitalizeFirstLetter(selectedDay)} {shift.timeWindowDisplay}
            </Typography>
          </Grid>
          <Grid xs={'auto'} md={'auto'} lg={'auto'}>
            <Typography bgcolor={'#F3F3F3'}>
              {shift.verificationBuffer} hour buffer
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={'auto'} md={'auto'} lg={'auto'} spacing={2}>
          <Grid xs={'auto'} lg={'auto'}>
            <Typography fontFamily={'Inter'} color={'#ACACAC'}>
              Also available on
            </Typography>
          </Grid>
          <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
            <Typography>{shift.possibleDays.join(', ')}</Typography>
          </Grid>
        </Grid>
      </Grid> */}
    </Box>
  )
}
export default ShiftInfoHeader
