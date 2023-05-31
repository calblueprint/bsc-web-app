import HouseForm from './HouseForm'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material'

function NewHouseCard({
  setOpen,
  open,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}) {
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
          Create House
        </DialogTitle>
        <DialogContent>
          <HouseForm
            setOpen={setOpen}
            houseId='EUC'
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default NewHouseCard
