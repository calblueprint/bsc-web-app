import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'
import { AlertTitle, Slide } from '@mui/material'
import Icon, { IconType } from '@/assets/Icon'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return (
    <MuiAlert
      sx={{ color: 'black', backgroundColor: 'white' }}
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  )
})

type ActionMsgBoxProps = {
  messageTop: string
  messageBottom: string
  iconType: IconType
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}

export const ActionMsgBox: React.FC<ActionMsgBoxProps> = ({
  messageTop,
  messageBottom,
  iconType,
  setOpen,
  open,
}: ActionMsgBoxProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert icon={<Icon type={iconType} />}>
          <AlertTitle>{messageTop}</AlertTitle>
          {messageBottom}
        </Alert>
      </Snackbar>
    </div>
  )
}
