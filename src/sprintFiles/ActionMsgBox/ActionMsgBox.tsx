import * as React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'
import { AlertTitle, Slide } from '@mui/material'
import Icon from '@/assets/Icon'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return (
    <MuiAlert
      sx={{color:"black", backgroundColor: "white"}}
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  )
})

type ActionMsgBoxProps = {
  messagePopUp: string
  messageButton: string
  iconType: any
}

export const ActionMsgBox: React.FC<ActionMsgBoxProps> = ({
  messagePopUp,
  messageButton,
  iconType,
}: ActionMsgBoxProps) => {
  const [open, setOpen] = React.useState(false)
  //console.log('type', type)
  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const alert = (
    <Alert onClose={handleClose}>
      {messagePopUp}
    </Alert>
  )

  return (
    <div>
      <Button onClick={handleClick}>{messageButton}</Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        // TransitionComponent={(props) => <Slide {...props} direction="left" />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert icon={<Icon type={iconType}/>}>
          <AlertTitle>Success</AlertTitle>
          This is a success alert
        </Alert>
      </Snackbar>
    </div>
  )
}
