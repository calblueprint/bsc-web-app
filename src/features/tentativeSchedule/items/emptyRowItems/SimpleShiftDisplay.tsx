import { selectCurrentHouse } from '@/features/auth/authSlice'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'
import {
  selectShiftById,
  useGetShiftsQuery,
} from '@/features/shift/shiftApiSlice'
import { ShiftAssignmentCard } from '@/features/userAssignment/cards/ShiftAssignmentCard'
import { RootState } from '@/store/store'
import { Shift } from '@/types/schema'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import { Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type DynamicShiftDisplayProps = {
  shiftId: string
  dayId: string
}

const SimpleShiftDisplay = (props: DynamicShiftDisplayProps) => {
  const { shiftId, dayId } = props

  const houseId = useSelector(selectCurrentHouse)?.id ?? ''
  const shift = useSelector((state: RootState) =>
    selectShiftById()(state, shiftId, houseId)
  )

  const [open, setOpen] = useState(false)
  const [openEditShift, setOpenEditShift] = useState(false)

  const handleClose = () => {
    console.log('handleClose activated')
    setOpen(false)
  }

  const handleEditShift = (userId: string) => {
    setOpenEditShift(true)
  }

  useEffect(() => {
    // console.log({ shift: shift })
  }, [shift])

  return shift ? (
    <Box onClick={() => setOpen(true)}>
      <Box
        textTransform={'capitalize'}
        padding={0.5}
        marginBottom={'2px'}
        marginLeft={1}
        component={Paper}
        elevation={3}
      >
        <Typography
          sx={{ fontSize: 14 }}
          textAlign={'center'}
          textTransform={'capitalize'}
        >
          {shift.name}
        </Typography>
      </Box>
      <ShiftAssignmentCard
        shiftId={shiftId}
        selectedDay={dayId}
        handleClose={handleClose}
        handleEditShift={handleEditShift}
        open={open}
      />
      <EditShiftCard
        shiftId={shiftId}
        setOpen={setOpenEditShift}
        open={openEditShift}
      />
    </Box>
  ) : null
}

export default SimpleShiftDisplay
