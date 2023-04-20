import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectHouseId } from '../categoriesSlice'

type CategoryShiftItemProps = {
  shiftId: string
}
const CategoryShiftItem = (props: CategoryShiftItemProps) => {
  const { shiftId } = props
  const houseId = useSelector(selectHouseId)
  const shift = useSelector((state: RootState) =>
    selectShiftById(houseId)(state, shiftId)
  )

  // useEffect(() => {
  //   console.log('Shift: ', shift)
  // }, [shift])

  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        sx={{ textTransform: 'capitalize' }}
      >
        {shift ? shift.name : shiftId}
      </TableCell>
    </TableRow>
  )
}

export default CategoryShiftItem
