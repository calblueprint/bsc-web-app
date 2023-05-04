import { Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { Box, Button, TextField, Typography } from '@mui/material'
import DateRangeComponent from '@/components/shared/forms/DateRangeComponent'
import { TextInput } from '@/components/shared/forms/CustomFormikFields'

interface PublishScheduleFormValues {
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  scheduleName: string
}

const PublishScheduleSchema = Yup.object({
  startDate: Yup.date().required('Please select a date'),
  endDate: Yup.date().required('Please select a date'),
  scheduleName: Yup.string()
    .required('Schedule Name is required')
    .min(1, 'Schedule Name must have at least 1 characters'),
})

type PublishScheduleFormProps = {
  setOpen: (value: React.SetStateAction<boolean>) => void
}

function PublishScheduleForm(props: PublishScheduleFormProps) {
  const { setOpen } = props
  const [error, setError] = useState(false)
  const onSubmit = (
    values: PublishScheduleFormValues,
    helpers: FormikHelpers<PublishScheduleFormValues>
  ) => {
    console.log(values)
    console.log(helpers)

    if (error) {
      console.log('Error: Form has an error')
      return
    }
    helpers.setSubmitting(false)
  }

  const handleError = (value: boolean) => {
    setError(value)
  }

  return (
    <Formik
      validationSchema={PublishScheduleSchema}
      initialValues={{
        startDate: dayjs(),
        endDate: dayjs().add(1, 'week'),
        scheduleName: '',
      }}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        return (
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                gap: '1rem',
              }}
            >
              <Box display={'flex'} flexDirection={'column'} maxWidth={'470px'}>
                <TextInput name="scheduleName" label="Schedule Name" />
              </Box>
              <DateRangeComponent
                startDateValue={values.startDate}
                endDateValue={values.endDate}
                setFieldValue={setFieldValue}
                setError={handleError}
              />
              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || error}
                  sx={{ marginLeft: 2 }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default PublishScheduleForm
