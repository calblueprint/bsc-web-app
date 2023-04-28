import { selectUserById } from '@/features/user/userApiSlice'
import { RootState } from '@/store/store'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { EntityId } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DAYS } from '@/utils/constants'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { selectUserDayScheduleByDay } from '../../scheduleSlice'

type CellScheduleShiftProps = {
  dayId: string
  userId: string
}
const CellScheduleShift = (props: CellScheduleShiftProps) => {
  const { dayId, userId } = props

  const shiftIds = useSelector((state: RootState) =>
    selectUserDayScheduleByDay(state, userId, dayId)
  )
  //   const shift = useSelector((state: RootState) =>
  //     selectShiftById('EUC')(state, shiftId)
  //   )

  useEffect(() => {
    // console.log(shiftIds)
    if (shiftIds.length) {
      //   console.log(shiftIds)
    }
  }, [shiftIds])

  return (
    <TableCell
      style={{
        minWidth: 200,
        borderLeft: '1px solid black',
      }}
    >
      {shiftIds.map((shiftId) => (
        <Box key={shiftId}>{shiftId}</Box>
      ))}
    </TableCell>
  )
}

export default CellScheduleShift
