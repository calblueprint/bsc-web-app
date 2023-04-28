import { selectCurrentHouse } from '@/features/auth/authSlice'
import {
  selectShiftById,
  useGetShiftsQuery,
} from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import { Shift } from '@/types/schema'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import { Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type DynamicShiftDisplayProps = {
  shiftId: string
}

const SimpleShiftDisplay = (props: DynamicShiftDisplayProps) => {
  const { shiftId } = props

  const houseId = useSelector(selectCurrentHouse)?.id ?? ''
  const shift = useSelector((state: RootState) =>
    selectShiftById()(state, shiftId, houseId)
  )

  useEffect(() => {
    // console.log({ shift: shift })
  }, [shift])

  return shift ? (
    <Box>
      <Box
        textTransform={'capitalize'}
        padding={0.5}
        marginBottom={'1px'}
        marginLeft={1}
      >
        <Typography
          sx={{ fontSize: 14, backgroundColor: 'lightgray' }}
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
