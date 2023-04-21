import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { selectHouseId } from '../categoriesSlice'
import { House, User } from '@/types/schema'

import { SelectInput } from '@/components/shared/forms/CustomFormikFields'
import { Form, Formik, FormikHelpers } from 'formik'
import Stack from '@mui/material/Stack'
import * as Yup from 'yup'
import { useUpdateShiftMutation } from '@/features/shift/shiftApiSlice'

const ShiftSchema = Yup.object({
  category: Yup.string().required('Cagegory is required'),
})

type EditCategoryBtnProps = {
  category: string
  shiftId: string | undefined
}

const EditCategoryBtn = (props: EditCategoryBtnProps) => {
  const { category, shiftId } = props
  const authHouse = useSelector(selectCurrentHouse) as House
  const houseId = useSelector(selectHouseId)

  //** Holds the house shifts categories */
  const [houseCategories, setHouseCategories] = useState<string[]>()

  const [open, setOpen] = useState(false)

  const [updateShift, {}] = useUpdateShiftMutation()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (
    values: {
      category: string
    },
    formikBag: FormikHelpers<any>
  ) => {
    const { category } = values
    if (!houseCategories || houseCategories.length === 0) {
      console.log('HouseCategories is undefined of empty: ', houseCategories)
      return
    }

    try {
      const data = {
        data: { category },
        houseId: houseId,
        shiftId: shiftId as string,
      }
      console.log('category', category)
      await updateShift(data)
    } catch (error) {
      console.log(error)
    }

    setOpen(false)
    console.log('save')
  }

  //** Get the house categories */
  useEffect(() => {
    if (authHouse) {
      setHouseCategories(authHouse.categories)
    }
  }, [authHouse])

  const button = (
    <Button
      onClick={() => setOpen(true)}
      fullWidth
      sx={{ marginLeft: 'auto', marginBottom: 2, fontSize: '16px' }}
      variant="contained"
    >
      Edit Category
    </Button>
  )
  const form = (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>
          <Box display={'flex'}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography>Edit Shift&lsquo;s Category</Typography>
            </Box>
            <Box flexGrow={1} />
            <Box>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {houseCategories && houseCategories.length ? (
            <Formik
              validationSchema={ShiftSchema}
              initialValues={{ category: category }}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <SelectInput
                    name="category"
                    label="Category"
                    labelid="category"
                    id="category"
                    options={houseCategories}
                    multiselect={false}
                  />

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {'Update'}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          ) : null}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
  return (
    <React.Fragment>
      {button}
      {form}
    </React.Fragment>
  )
}

export default EditCategoryBtn
