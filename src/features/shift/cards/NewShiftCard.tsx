import ShiftForm from '../forms/ShiftForm'
import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'

function NewShiftCard({
  shiftId,
  setOpen,
  open,
}: {
  shiftId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}) {
  // const [shiftValues, setShiftValues] = useState(null)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className="dialog"
      >
        <DialogTitle variant="h4" component="h2">
          Create Shift
        </DialogTitle>
        <DialogContent>
          <ShiftForm
            setOpen={setOpen}
            // shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
            isNewShift={true}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default NewShiftCard
