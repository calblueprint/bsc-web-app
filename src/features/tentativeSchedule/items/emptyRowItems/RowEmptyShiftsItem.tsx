import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import CellShiftsItme from './CellShiftsItme'
import { DAYS } from '@/utils/constants'

const RowEmptyShiftsItem = () => {
  const stickyStyle = {
    background: 'white',
    position: 'sticky',
    zIndex: 10,
  }
  return (
    <TableRow sx={{ ...stickyStyle, top: 57 }}>
      <TableCell
        align="center"
        style={{
          minWidth: 200,
          height: 100,
          borderRight: '1px solid black',
          position: 'sticky',
          left: 0,
          backgroundColor: 'white',
          zIndex: 1, // add z-index to ensure it appears above other columns
          fontWeight: 'bold',
        }}
      >
        Empty Shifts
      </TableCell>
      {DAYS
        ? DAYS.map((day) => <CellShiftsItme key={day} dayId={day} />)
        : null}

      {/* Add more cells as needed */}
    </TableRow>
  )
}

export default RowEmptyShiftsItem
