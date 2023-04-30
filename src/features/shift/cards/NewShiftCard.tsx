import ShiftForm from '../forms/ShiftForm'
import { Dialog, DialogContent, DialogTitle, Box } from '@mui/material'
import styles from '../../user/forms/UserForm.module.css'
import CloseIcon from '@mui/icons-material/Close'

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

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className="dialog"
      >
        <Box margin={'5%'}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <DialogTitle variant="h4" component="h2">
              Create Shift
            </DialogTitle>
            <CloseIcon fontSize="large" onClick={handleClose} />
          </Box>

          <hr className={styles.line} />
          <DialogContent>
            <ShiftForm
              setOpen={setOpen}
              // shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
              isNewShift={true}
            />
          </DialogContent>
        </Box>
      </Dialog>
    </>
  )
}
export default NewShiftCard
