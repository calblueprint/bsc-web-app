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
import { ShiftAssignmentCard } from '@/features/userAssignment/cards/ShiftAssignmentCard'

type CellShiftsItmeProps = {
  dayId: string
}

const CellShiftsItme = (props: CellShiftsItmeProps) => {
  const { dayId } = props

  // const { data: shifts } = useGetShiftsQuery('EUC')
  const shiftIds = useSelector((state: RootState) =>
    selectEmptyShiftsByDay(state, dayId)
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
        <React.Fragment>
          {Array.isArray(shiftIds)
            ? shiftIds.map((shiftId) => {
                return (
                  <SimpleShiftDisplay
                    key={shiftId}
                    shiftId={shiftId}
                    handleClick={handleClick}
                  />
                )
              })
            : null}
        </React.Fragment>
      </Box>
      <ShiftAssignmentCard
        shiftId={clickedShiftId}
        selectedDay={dayId}
        handleClose={handleClose}
        open={open}
      />
    </TableCell>
  )
}

export default CellShiftsItme
