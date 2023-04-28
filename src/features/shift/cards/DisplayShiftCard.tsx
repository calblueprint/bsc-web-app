import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectShiftById } from '../shiftApiSlice'
import { selectHouseId } from '@/features/categories/categoriesSlice'
import { Shift } from '@/types/schema'
import { RootState } from '@/store/store'
import { EntityId } from '@reduxjs/toolkit'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import EditCategoryBtn from '@/features/categories/buttons/EditCategoryBtn'

type DisplayShiftCardProps = {
  shiftId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}

const DisplayShiftCard = (props: DisplayShiftCardProps) => {
  const { shiftId, setOpen, open } = props
  const houseId = useSelector(selectHouseId)

  //** for editing shifts */
  // const shift: Shift = useSelector((state: RootState) =>
  //   selectShiftById(houseId)(state, shiftId as EntityId)
  // )
  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById()(state, shiftId as EntityId, houseId) as Shift
  )

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <Box>
            <Typography textTransform={'capitalize'} variant="h3">
              {shift.name}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>{`Description: ${shift.description}`}</Box>
              </Grid>
              <Grid item xs={2}>
                <Box>{`Credit Hours: ${shift.hours}`}</Box>
              </Grid>
              <Grid item xs={2}>
                <Box>{`Buffer Hours: ${shift.verificationBuffer}`}</Box>
              </Grid>
              <Grid item xs={8}>
                <Box>{`Time Window: ${shift.timeWindowDisplay}`}</Box>
              </Grid>
              <Grid item xs={8}>
                <Box>{`Possible Days: ${shift.possibleDays}`}</Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography
                        sx={{ backgroundColor: '#EFEFEF' }}
                        variant="h6"
                      >
                        {`Category: ${shift.category}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <EditCategoryBtn
                        shiftId={shiftId}
                        category={shift.category}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default DisplayShiftCard
