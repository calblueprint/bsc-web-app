import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import NewShiftCard from '../cards/NewShiftCard'

const NewShiftBtn = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <React.Fragment>
      <Button fullWidth variant="contained" onClick={handleOpen}>
        <Typography>Add Shift</Typography>
      </Button>
      <NewShiftCard setOpen={setOpen} open={open} />
    </React.Fragment>
  )
}

export default NewShiftBtn
