import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { Shift } from '@/types/schema'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import SimpleShiftDisplay from './SimpleShiftDisplay'

type CellShiftsItmeProps = {
  shiftIds: string[]
}

const CellShiftsItme = (props: CellShiftsItmeProps) => {
  const { shiftIds } = props

  const { data: shifts } = useGetShiftsQuery('EUC')
  const [shiftEntities, setShiftEntities] = useState<Dictionary<Shift>>()

  useEffect(() => {
    if (shifts) {
      setShiftEntities(shifts.entities)
    }
  }, [shifts])

  return (
    <TableCell
      // padding="checkbox"
      style={{
        minWidth: 200,
        borderLeft: '1px solid black',
        padding: '2px',
      }}
    >
      <Box padding={0} sx={{ maxHeight: '100px', overflowY: 'scroll' }}>
        {shiftIds.map((shiftId) => (
          <SimpleShiftDisplay
            key={shiftId}
            shift={shiftEntities ? shiftEntities[shiftId] : undefined}
          />
        ))}
      </Box>
    </TableCell>
  )
}

export default CellShiftsItme
