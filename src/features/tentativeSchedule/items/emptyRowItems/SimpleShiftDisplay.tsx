import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { Shift } from '@/types/schema'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'

type DynamicShiftDisplayProps = {
  shift: Shift | undefined
}

const SimpleShiftDisplay = (props: DynamicShiftDisplayProps) => {
  const { shift } = props
  return shift ? (
    <Box>
      <Box
        textTransform={'capitalize'}
        padding={0.5}
        marginBottom={1}
        marginLeft={1}
      >
        {shift.name}
      </Box>
    </Box>
  ) : null
}

export default SimpleShiftDisplay
