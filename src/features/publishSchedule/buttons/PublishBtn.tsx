import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import React, { useState } from 'react'
import Divider from '@mui/material/Divider'
import PublishScheduleForm from '../forms/PublishScheduleForm'

const PublishBtn = () => {
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Box display={'flex'} marginLeft={'auto'} marginBottom={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Publish Schedule
        </Button>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        className="dialog"
      >
        <DialogTitle variant="h4" component="h2">
          Publish Tentative Schedule
        </DialogTitle>
        <Divider />
        <DialogContent>
          <PublishScheduleForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default PublishBtn
