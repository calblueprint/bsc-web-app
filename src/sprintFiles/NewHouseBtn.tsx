import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import NewHouseCard from './NewHouseCard'

const NewHouseBtn = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <React.Fragment>
      <Button fullWidth variant="contained" onClick={handleOpen}>
        <Typography>Add House</Typography>
      </Button>
      <NewHouseCard setOpen={setOpen} open={open} />
    </React.Fragment>
  )
}

export default NewHouseBtn