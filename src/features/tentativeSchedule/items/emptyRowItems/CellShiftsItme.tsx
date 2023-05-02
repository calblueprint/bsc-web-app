import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { Shift } from '@/types/schema'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import SimpleShiftDisplay from './SimpleShiftDisplay'
import { useSelector } from 'react-redux'
import { selectEmptyShiftsByDay } from '../../scheduleSlice'
import { RootState } from '@/store/store'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'

type CellShiftsItmeProps = {
  dayId: string
}

const CellShiftsItme = (props: CellShiftsItmeProps) => {
  const { dayId } = props

  // const { data: shifts } = useGetShiftsQuery('EUC')
  const shiftIds = useSelector((state: RootState) =>
    selectEmptyShiftsByDay(state, dayId)
  )

  useEffect(() => {
    // console.log({ shiftIds: shiftIds })
  }, [shiftIds])

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
        {Array.isArray(shiftIds)
          ? shiftIds.map((shiftId) => {
              return (
                <React.Fragment key={shiftId}>
                  <SimpleShiftDisplay shiftId={shiftId} dayId={dayId} />
                </React.Fragment>
              )
            })
          : null}
      </Box>
    </TableCell>
  )
}

export default CellShiftsItme
