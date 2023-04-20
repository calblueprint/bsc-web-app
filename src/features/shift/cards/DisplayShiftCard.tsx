import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import React from 'react'

type DisplayShiftCardProps = {
  shiftId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}

const DisplayShiftCard = (props: DisplayShiftCardProps) => {
  const { shiftId, setOpen, open } = props
  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>Title</DialogTitle>
        <DialogContent>Content</DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default DisplayShiftCard
