import { Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { Box, Button, TextField, Typography, setRef } from '@mui/material'
import DateRangeComponent from '@/components/shared/forms/DateRangeComponent'
import { TextInput } from '@/components/shared/forms/CustomFormikFields'
import { EntityState } from '@reduxjs/toolkit'
import {
  House,
  PublishedSchedulesType,
  ScheduledShift,
  Shift,
} from '@/types/schema'
import {
  AssignedUserShiftsType,
  selectAssignedUserShifts,
} from '@/features/tentativeSchedule/scheduleSlice'
import weekday from 'dayjs/plugin/weekday'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useAddNewScheduledShiftBatchMutation } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'

dayjs.extend(weekday)

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

type CreateScheduleShiftsProps = {
  shiftState: EntityState<Shift>
  assignedShifts: AssignedUserShiftsType
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
}

const dayIdToNumber = (dayId: string): number | undefined => {
  const days = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  }

  return days[dayId.toLowerCase() as keyof typeof days]
}

const createScheduleShifts = (
  props: CreateScheduleShiftsProps
): ScheduledShift[] => {
  const { shiftState, assignedShifts, startDate, endDate } = props
  if (!shiftState || !assignedShifts || !startDate || !endDate) {
    console.log(
      'Invalid inputs ---> shiftState: ',
      shiftState,
      '  assignedShift: ',
      assignedShifts,
      ' startDate: ',
      startDate,
      ' endDate: ',
      endDate
    )
    return []
  }

  const entities = shiftState.entities
  const createdShifts: ScheduledShift[] = []

  for (const userId in assignedShifts) {
    for (const dayId in assignedShifts[userId]) {
      const shiftDay = dayIdToNumber(dayId)
      if (shiftDay === undefined) {
        continue
      }

      let firstOccurrence = startDate.clone().day(shiftDay)
      if (firstOccurrence.isAfter(endDate)) {
        continue
      }
      if (firstOccurrence.isBefore(startDate)) {
        // console.log('Original date: ', firstOccurrence)
        firstOccurrence = firstOccurrence.add(1, 'week')
        // console.log('added a week: ', firstOccurrence)
      }

      for (const shiftId of assignedShifts[userId][dayId]) {
        const shift = entities[shiftId]
        if (!shift) {
          continue
        }

        for (
          let currentDate = firstOccurrence.clone();
          currentDate.isBefore(endDate) || currentDate.isSame(endDate);
          currentDate = currentDate.add(1, 'week')
        ) {
          createdShifts.push({
            id: '',
            shiftID: shiftId,
            date: currentDate.format('MM/DD/YYYY'),
            assignedUser: userId,
            status: 'Assigned',
            options: '',
            verifiedBy: '',
            verifiedAt: '',
            unverifiedAt: '',
            penaltyHours: 0,
          })
        }
      }
    }
  }

  return createdShifts
}

// const createScheduleShifts = (props: CreateScheduleShiftsProps) => {
//   const { shiftState, assignedShifts, startDate, endDate } = props
//   if (!shiftState || !assignedShifts || !startDate || !endDate) {
//     console.log(
//       'Invalid inputs ---> shiftState: ',
//       shiftState,
//       '  assignedShift: ',
//       assignedShifts,
//       ' startDate: ',
//       startDate,
//       ' endDate: ',
//       endDate
//     )
//     return {}
//   }

//   const ids = shiftState.ids
//   const entities = shiftState.entities
//   const createdShifts: Record<string, ScheduledShift[]> = {}
//   Object.keys(assignedShifts).forEach((userId) => {
//     Object.keys(assignedShifts[userId]).forEach((dayId) => {
//       assignedShifts[userId][dayId].forEach((shiftId) => {
//         const shift = entities[shiftId]
//         if (!shift) {
//           return false
//         }
//       })
//     })
//   })

//   return createdShifts
// }

type PublishScheduleFormProps = {
  setOpen: (value: React.SetStateAction<boolean>) => void
}

function PublishScheduleForm(props: PublishScheduleFormProps) {
  const { setOpen } = props
  const [error, setError] = useState(false)

  const currentHouse = useSelector(selectCurrentHouse) as House

  const assignedShifts = useSelector(selectAssignedUserShifts)

  const [scheduleNames, setScheduleNames] = useState<string[] | undefined>(
    undefined
  )
  const [dateRanges, setDateRanges] = useState<
    Record<string, string> | undefined
  >(undefined)

  //** House shifts */
  const { data: shiftsData, isSuccess: isShiftsSuccess } = useGetShiftsQuery(
    currentHouse.id
  )

  const [addNewScheduledShiftBatch, { isLoading: batchIsLoading }] =
    useAddNewScheduledShiftBatchMutation()

  const [updateHouses, {}] = useUpdateHousesMutation()

  const validateInputs = (values: PublishScheduleFormValues) => {
    const { scheduleName, startDate, endDate } = values
    if (!scheduleName || !startDate || !endDate) {
      console.error('Invalid schedule inputs')
      return false
    }
    if (!currentHouse) {
      console.log('House is not defined')
      return false
    }
    if (currentHouse.publishedSchedules) {
      return true
    }
    const publishedSchedules: PublishedSchedulesType =
      currentHouse.publishedSchedules

    for (const name in publishedSchedules) {
      if (name.toLowerCase === scheduleName.toLowerCase) {
      }
    }
  }

  const onSubmit = async (
    values: PublishScheduleFormValues,
    helpers: FormikHelpers<PublishScheduleFormValues>
  ) => {
    console.log(values)
    console.log(helpers)

    if (error) {
      console.log('Error: Form has an error')
      return
    }

    validateInputs(values)

    const publishedSchedules = {
      [values.scheduleName]: {
        startDate: values.startDate,
        endDate: values.endDate,
        assignedShifts: assignedShifts,
      },
    }

    const list = createScheduleShifts({
      shiftState: shiftsData as EntityState<Shift>,
      assignedShifts,
      startDate: values.startDate,
      endDate: values.endDate,
    })

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
  }

  const handleError = (value: boolean) => {
    setError(value)
  }

  useEffect(() => {
    if (currentHouse && currentHouse.publishedSchedules) {
      const sNames = []
      let ranges = {}
      for (const schedule in currentHouse.publishedSchedules) {
        sNames.push(schedule)
        const obj = currentHouse.publishedSchedules[schedule]
        ranges = { ...ranges, [obj.startTime]: obj.endTime }
      }
      setScheduleNames(sNames)
      setDateRanges(ranges)
    }
  }, [currentHouse])

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
                <Typography marginLeft={1.5} variant="caption" color={'error'}>
                  Name already exist
                </Typography>
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
