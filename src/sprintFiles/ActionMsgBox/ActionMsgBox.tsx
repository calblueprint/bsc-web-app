import * as React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'
import { Slide } from '@mui/material'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

type ActionMsgBoxProps = {
  messagePopUp: string
  messageButton: string
  type: AlertColor | undefined
}

export const ActionMsgBox: React.FC<ActionMsgBoxProps> = ({
  messagePopUp,
  messageButton,
  type, //success, info, error, warning (undefined will do nothing)
}: ActionMsgBoxProps) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleClick}>{messageButton}</Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        // TransitionComponent={(props) => <Slide {...props} direction="left" />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={type}>
          {messagePopUp}
        </Alert>
      </Snackbar>
    </div>
  )
}
