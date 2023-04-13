import React from 'react'
import { Button, Slide, Snackbar } from '@mui/material'
import Icon from '../../assets/Icon'

type ActionMsgBoxProps = {
  messagePopUp: string
  messageButton: string
}

export const ActionMsgBox: React.FC<ActionMsgBoxProps> = ({
  messagePopUp,
  messageButton,
}: ActionMsgBoxProps) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    console.log("closing")
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleClick}>{messageButton}</Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={1000}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
        message={messagePopUp}
        onClose={handleClose}
      />
    </div>
  )
}
