import { selectCurrentHouse } from '@/features/auth/authSlice'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
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
  handleClick: (shiftId: string) => void
}

const SimpleShiftDisplay = (props: DynamicShiftDisplayProps) => {
  const { shiftId, handleClick } = props

  const houseId = useSelector(selectCurrentHouse)?.id ?? ''
  const shift = useSelector((state: RootState) =>
    selectShiftById()(state, shiftId, houseId)
  )

  useEffect(() => {
    // console.log({ shift: shift })
  }, [shift])

  return shift ? (
    <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(shiftId)}>
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
    </Box>
  ) : null
}

export default SimpleShiftDisplay
