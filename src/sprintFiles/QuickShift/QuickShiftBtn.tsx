import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import React from 'react'
import { useState } from 'react'
import NewQuickShiftCard from './NewQuickShiftCard'

//Quick Shift == New Shift card that deals wi
//TODOS: Look below
// Split quickshift card into shift card and quickshiftbtn.
// Have an assigned user.  Well-defined date.
// no categories
// select a single day
// skips the shift step of creating schedule.
// will only create a scheduled shift, NOT a SHIFT object.
function QuickShiftBtn() {
  const [open, setOpen] = useState(false)
  // const [shiftValues, setShiftValues] = useState(null)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <React.Fragment>
      <Button fullWidth variant="contained" onClick={handleOpen}>
        <Typography>Quick Shift</Typography>
      </Button>
      <NewQuickShiftCard setOpen={setOpen} open={open} />
    </React.Fragment>
  )
}
export default QuickShiftBtn
