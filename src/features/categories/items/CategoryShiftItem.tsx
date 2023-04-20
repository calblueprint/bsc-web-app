import { selectShiftById } from '@/features/shift/shiftApiSlice'
import { RootState } from '@/store/store'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectHouseId } from '../categoriesSlice'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'

type CategoryShiftItemProps = {
  shiftId: string
}
const CategoryShiftItem = (props: CategoryShiftItemProps) => {
  const { shiftId } = props
  const houseId = useSelector(selectHouseId)
  const shift = useSelector((state: RootState) =>
    selectShiftById(houseId)(state, shiftId)
  )
  const [open, setOpen] = useState(false)

  const handleRowClick = () => {
    setOpen(true)
  }

  // useEffect(() => {
  //   console.log('Shift: ', shift)
  // }, [shift])

  return (
    <React.Fragment>
      <TableRow onClick={handleRowClick}>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: 'capitalize' }}
        >
          {shift ? shift.name : shiftId}
        </TableCell>
      </TableRow>
      <EditShiftCard shiftId={shiftId} setOpen={setOpen} open={open} />
    </React.Fragment>
  )
}

export default CategoryShiftItem
