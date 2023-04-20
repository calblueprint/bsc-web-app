import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import ScheduledShiftForm from './QuickShiftForm'

//Quick Shift == New Shift card that deals wi
//TODOS: Look below
// Split quickshift card into shift card and quickshiftbtn.
// Have an assigned user.  Well-defined date.
// no categories
// select a single day
// skips the shift step of creating schedule.
// will only create a scheduled shift, NOT a SHIFT object.
function NewQuickShiftCard({
  setOpen,
  open,
}: {
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
          Create Quick Shift
        </DialogTitle>
        <DialogContent>
          <ScheduledShiftForm
            setOpen={setOpen}
            // shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
            isNewShift={true}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default NewQuickShiftCard
