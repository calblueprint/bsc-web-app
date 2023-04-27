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
      <Button variant="contained" onClick={handleOpen}>
        <Typography>New Shift +</Typography>
      </Button>
      <NewShiftCard setOpen={setOpen} open={open} />
    </React.Fragment>
  )
}

export default NewShiftBtn
