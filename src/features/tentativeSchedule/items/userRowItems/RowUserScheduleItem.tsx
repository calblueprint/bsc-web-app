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
import CellScheduleShift from './CellScheduleShift'
import { Typography } from '@mui/material'

type RowUserScheduleItemProps = {
  userId: EntityId
}
const RowUserScheduleItem = (props: RowUserScheduleItemProps) => {
  const { userId } = props
  const user = useSelector((state: RootState) => selectUserById(state, userId))

  const [weeklySchedule, setWeeklySchedule] = useState(undefined)
  useEffect(() => {}, [user])
  return user ? (
    <TableRow>
      <TableCell
        align="center"
        style={{
          minWidth: 250,
          position: 'sticky',
          borderRight: '1px solid black',
          backgroundColor: 'white',
          zIndex: 4,
          left: 0,
        }}
      >
        <Box>
          <Typography fontWeight="bold"> {user.displayName}</Typography>
        </Box>
        <Box>
          {`Hours Needed: ${
            5 - (user.hoursAssigned ? user.hoursAssigned : 0)
          } hrs`}
        </Box>
      </TableCell>
      {DAYS
        ? DAYS.map((day) => (
            <CellScheduleShift
              key={day}
              dayId={day}
              userId={userId as string}
            />
          ))
        : null}
    </TableRow>
  ) : null
}

export default RowUserScheduleItem
