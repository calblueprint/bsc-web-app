import { selectUserById } from '@/features/user/userApiSlice'
import { RootState } from '@/store/store'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { EntityId } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DAYS } from '@/utils/constants'
import {
  selectMultipleAssignedShiftById,
  selectShiftById,
} from '@/features/shift/shiftApiSlice'
import {
  selectAssignedUserShiftsByIdDay,
  selectUserScheduleByIdDay,
} from '../../scheduleSlice'
import ScheduleShiftDisplay from './ScheduleShiftDisplay'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { ShiftAssignmentCard } from '@/features/userAssignment/cards/ShiftAssignmentCard'

type CellScheduleShiftProps = {
  dayId: string
  userId: string
}
const CellScheduleShift = (props: CellScheduleShiftProps) => {
  const { dayId, userId } = props

  const houseId = useSelector(selectCurrentHouse)?.id ?? ''
  const shiftIds = useSelector((state: RootState) =>
    selectUserScheduleByIdDay(state, userId, dayId)
  )

  const assignedShifts = useSelector((state: RootState) =>
    selectAssignedUserShiftsByIdDay(state, userId, dayId)
  )

  const [open, setOpen] = useState(false)
  const [clickedShiftId, setClickedShiftId] = useState('')

  const handleClose = () => {
    setOpen(false)
    setClickedShiftId('')
  }

  const handleClick = (shiftId: string) => {
    setClickedShiftId(shiftId)
    setOpen(true)
  }

  useEffect(() => {
    // console.log(assignedShifts)
    if (assignedShifts.length) {
      // console.log({ [userId]: assignedShifts })
    }
  }, [assignedShifts])

  return (
    <TableCell
      style={{
        minWidth: 200,
        borderLeft: '1px solid black',
      }}
    >
      <React.Fragment>
        {assignedShifts.map((shiftId) => {
          return (
            <ScheduleShiftDisplay
              key={shiftId}
              shiftId={shiftId as string}
              handleClick={handleClick}
            />
          )
        })}
      </React.Fragment>
      <ShiftAssignmentCard
        shiftId={clickedShiftId}
        selectedDay={dayId}
        handleClose={handleClose}
        open={open}
      />
    </TableCell>
  )
}

export default CellScheduleShift
