import { Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material'
import DateRangeComponent from '@/components/shared/forms/DateRangeComponent'
import { TextInput } from '@/components/shared/forms/CustomFormikFields'
import { EntityState } from '@reduxjs/toolkit'
import {
  House,
  PublishedSchedulesType,
  ScheduledShift,
  Shift,
  User,
} from '@/types/schema'
import {
  AssignedUserShiftsType,
  selectAssignedUserShifts,
} from '@/features/tentativeSchedule/scheduleSlice'
import weekday from 'dayjs/plugin/weekday'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useAddNewScheduledShiftBatchMutation } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'
import isBetween from 'dayjs/plugin/isBetween'
import { createScheduleShifts } from '@/utils/utils'

dayjs.extend(isBetween) // extend Day.js with the isBetween plugin
dayjs.extend(weekday)

interface PublishScheduleFormValues {
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  scheduleName: string
}

type PublishScheduleFormProps = {
  setOpen: (value: React.SetStateAction<boolean>) => void
}

const PublishScheduleSchema = Yup.object({
  startDate: Yup.date().required('Please select a date'),
  endDate: Yup.date().required('Please select a date'),
  scheduleName: Yup.string()
    .required('Schedule Name is required')
    .min(1, 'Schedule Name must have at least 1 characters'),
})

function PublishScheduleForm(props: PublishScheduleFormProps) {
  const { setOpen } = props

  const authUser = useSelector(selectCurrentUser) as User
  const currentHouse = useSelector(selectCurrentHouse) as House
  const assignedShifts = useSelector(selectAssignedUserShifts)

  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [openErrorMsg, setOpenErrorMsg] = useState(false)

  //** House shifts */
  const { data: shiftsData, isSuccess: isShiftsSuccess } = useGetShiftsQuery(
    currentHouse.id
  )

  const [addNewScheduledShiftBatch, {}] = useAddNewScheduledShiftBatchMutation()
  const [updateHouses, {}] = useUpdateHousesMutation()
  const [establishContext, {}] = useEstablishContextMutation()

  const validateInputs = (
    scheduleName: string,
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
  ) => {
    if (!scheduleName || !startDate || !endDate) {
      console.error('Invalid schedule inputs')
      setErrorMsg('Invalid schedule inputs')
      return false
    }
    if (!currentHouse) {
      console.log('House is not defined')
      setErrorMsg('House is not defined')
      return false
    }
    if (!currentHouse.publishedSchedules) {
      console.log('Schedules are not defined')
      return true
    }
    const publishedSchedules: PublishedSchedulesType =
      currentHouse.publishedSchedules

    for (const name in publishedSchedules) {
      const start = Math.max(
        dayjs(publishedSchedules[name].startDate, 'MM/DD/YYYY')
          .startOf('day')
          .unix(),
        startDate.startOf('day').unix()
      )
      console.log(start)
      const end = Math.min(
        dayjs(publishedSchedules[name].endDate, 'MM/DD/YYYY')
          .startOf('day')
          .unix(),
        endDate.startOf('day').unix()
      )
      console.log(`range: ${start}-${end}`)
      console.log(`range: ${end - start}`)
      if (end - start >= 0) {
        setErrorMsg(
          `Dates overlap with ${name} please choose a different range`
        )
        return false
      }
    }
    return true
  }

  const onSubmit = async (
    values: PublishScheduleFormValues,
    helpers: FormikHelpers<PublishScheduleFormValues>
  ) => {
    console.log(values)
    console.log(helpers)
    const scheduleName = `${values.scheduleName}-${values.startDate.format(
      'MM/DD/YYYY'
    )}-${values.endDate.format('MM/DD/YYYY')}`

    if (error) {
      console.log('Error: Form has an error')
      return
    }

    if (!validateInputs(scheduleName, values.startDate, values.endDate)) {
      console.log('invalid inputs')
      setOpenErrorMsg(true)
      return
    }

    let publishedSchedules: PublishedSchedulesType = {
      [scheduleName]: {
        startDate: values.startDate.format('MM/DD/YYYY'),
        endDate: values.endDate.format('MM/DD/YYYY'),
        assignedShifts: assignedShifts,
      },
    }
    if (currentHouse.publishedSchedules) {
      publishedSchedules = {
        ...currentHouse.publishedSchedules,
        ...publishedSchedules,
      }
    }

    const list = createScheduleShifts({
      shiftState: shiftsData as EntityState<Shift>,
      assignedShifts,
      startDate: values.startDate,
      endDate: values.endDate,
    })

    console.log('shifts created: ++++++')

    try {
      const data = {
        houseId: currentHouse.id,
        data: { publishedSchedules },
      }

      await updateHouses(data)
      await establishContext(authUser.id)
    } catch (error) {
      console.log(error)
    }

    try {
      await addNewScheduledShiftBatch({
        houseId: currentHouse?.id,
        data: list,
      }).unwrap()
    } catch (error) {
      console.log(error)
    }

    // console.log({
    //   dates: { startDate: values.startDate, endDate: values.endDate },
    // })
    // console.log({ list: list })
    helpers.setSubmitting(false)
    helpers.resetForm()
    setOpen(false)
  }

  const handleError = (value: boolean) => {
    setError(value)
  }

  return (
    <React.Fragment>
      <Formik
        validationSchema={PublishScheduleSchema}
        initialValues={{
          startDate: dayjs().add(1, 'day'),
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
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  maxWidth={'470px'}
                >
                  <TextInput name="scheduleName" label="Schedule Name" />
                  {/* <Typography marginLeft={1.5} variant="caption" color={'error'}>
                  Name already exist
                </Typography> */}
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
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openErrorMsg}
        onClose={() => setOpenErrorMsg(false)}
      >
        <DialogTitle>Schedule Conflict</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>{`${errorMsg}`}</DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default PublishScheduleForm
