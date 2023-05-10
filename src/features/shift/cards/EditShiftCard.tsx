import React, { useState } from 'react'
import ShiftForm from '../forms/ShiftForm'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

function EditShiftCard({
  shiftId,
  setOpen,
  open,
}: {
  shiftId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}) {
  const [isNewShift, setIsNewShift] = useState(false)
  const handleDuplication = () => {
    setIsNewShift(true)
  }

  const handleOpenClose = (value: React.SetStateAction<boolean>) => {
    setOpen(value)
    setIsNewShift(value)
  }
  React.useEffect(() => {
    // console.log(selectShiftsResult((state) => state))
  }, [])
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => {
          setIsNewShift(false)
          setOpen(false)
        }}
        className="dialog"
      >
        <DialogTitle>
          <Box display={'flex'}>
            <Typography variant="h4" component="h2">
              {isNewShift ? 'Create Shift' : 'Update Shift'}
            </Typography>
            {isNewShift ? null : (
              <Button onClick={handleDuplication} variant="contained">
                Duplicate Shift
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <ShiftForm
            setOpen={handleOpenClose}
            shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
            isNewShift={isNewShift}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default EditShiftCard
