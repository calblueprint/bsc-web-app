import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React from 'react'

type CategoryShiftItemProps = {
  shiftId: string
}
const CategoryShiftItem = (props: CategoryShiftItemProps) => {
  const { shiftId } = props
  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        sx={{ textTransform: 'capitalize' }}
      >
        {shiftId}
      </TableCell>
    </TableRow>
  )
}

export default CategoryShiftItem
