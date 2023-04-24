import { Formik, Form, FormikHelpers } from 'formik'
import { Stack, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'

import dayjs, { Dayjs } from 'dayjs'
import * as Yup from 'yup'
import {
  TextInput,
  SelectInput,
} from '../../../components/shared/forms/CustomFormikFields'
import {
  selectShiftById,
  useAddNewShiftMutation,
  useGetShiftsQuery,
  useUpdateShiftMutation,
} from '../../shift/shiftApiSlice'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { formatMilitaryTime } from '../../../utils/utils'
import { RootState } from '../../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { House, Shift, User } from '../../../types/schema'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const ShiftSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  description: Yup.string(),
  possibleDays: Yup.array()
    .of(Yup.string())
    .test('notEmpty', 'Possible days is required', (value) => {
      return value && value.length > 0
    }),
  startTime: Yup.date().required('Start time is required'),
  endTime: Yup.date().required('End time is required'),
  category: Yup.string().required('Cagegory is required'),
  hours: Yup.number().required('Hours credit is required'),
  verificationBuffer: Yup.number(),
  assignedUser: Yup.string(),
  assignedDay: Yup.string(),
})

const daysList = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// const shiftCategories = ['cook dinner', 'clean bathroom', 'wash dishes', 'clean basement']

const emptyShift = {
  name: '',
  category: '',
  possibleDays: [],
  startTime: dayjs('2023-04-17T12:00'),
  endTime: dayjs('2023-04-17T18:30'),
  hours: 0,
  despription: '',
  verificationBuffer: 0,
  assignedUser: '',
  assignedDay: '',
}

const ShiftForm = ({
  setOpen,
  shiftId,
  isNewShift,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  shiftId?: string
  isNewShift: boolean
}) => {
  // const authUser = useSelector(selectCurrentUser) as User
  const currentHouse = useSelector(selectCurrentHouse) as House

  //** House shifts */
  const { data: shiftsData, isSuccess: isShiftsSuccess } = useGetShiftsQuery(
    currentHouse.id
  )

  //** for editing shifts */
  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById(currentHouse.id)(state, shiftId as EntityId) as Shift
  )

  //** Holds the house shifts categories */
  const [houseCategories, setHouseCategories] = useState<string[]>([
    'Uncategorized',
  ])

  //** Get the house categories */
  useEffect(() => {
    // console.log('currentHouse: ', currentHouse)
    // console.log('shiftsData: ', shiftsData)
    if (shiftsData && isShiftsSuccess) {
      // console.log('shiftsData: ', shiftsData)
      const categories = [...houseCategories]
      shiftsData.ids.forEach((id) => {
        const category = shiftsData.entities[id]?.category
        if (category && !categories.includes(category)) {
          categories.push(category)
        }
      })
      // console.log('Categories: ', categories)
      setHouseCategories(categories)
    }
  }, [shiftsData, isShiftsSuccess, houseCategories])

  //* Get API helpers to create or update a shift
  const [
    addNewShift,
    {
      // isLoading: isLoadingNewShift,
      // isSuccess: isSuccessNewShift,
      // isError: isErrorNewShift,
      // error: errorNewShift,
    },
  ] = useAddNewShiftMutation()
  const [
    updateShift,
    {
      // isLoading: isLoadingUpdateShift,
      // isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const onSubmit = async (
    values: {
      name: string
      category: string
      hours: number
      startTime: Dayjs
      endTime: Dayjs
      possibleDays: string[]
      description: string
      verificationBuffer: number
      assignedUser: string | undefined
      assignedDay: string
    },
    formikBag: FormikHelpers<any>
  ) => {
    // console.log('Submiting ShiftForm: ', values)
    const {
      name,
      category: categoryString,
      hours: strHours,
      description,
      possibleDays,
      startTime: startTimeObject,
      endTime: endTimeObject,
      verificationBuffer,
      assignedUser,
      assignedDay,
    } = values

    const hours = Number(strHours)
    const startTime = Number(startTimeObject.format('HHmm'))
    const endTime = Number(endTimeObject.format('HHmm'))
    let category
    if (categoryString === undefined || categoryString === 'Uncategorized') {
      category = ''
    } else {
      category = categoryString
    }

    // console.log(dayjs('1900', 'HHmm').format('HHmm'))
    // const num = 1900
    // console.log(dayjs(num.toString(), 'HHmm'))

    // const dayString = possibleDays.join('')
    let result
    const timeWindow = { startTime, endTime }
    const timeWindowDisplay =
      formatMilitaryTime(startTime) + ' - ' + formatMilitaryTime(endTime)
    const data = { data: {}, houseId: '', shiftId: '' }
    data.data = {
      name,
      category,
      hours,
      possibleDays,
      description,
      timeWindow,
      verificationBuffer,
      timeWindowDisplay,
      assignedUser,
      assignedDay,
    }
    data.houseId = currentHouse.id
    data.shiftId = shiftId ? shiftId : ''
    console.log('Type of: ', typeof Number(hours))
    // console.log('data: ', data)
    if (isNewShift || !shiftId) {
      result = await addNewShift(data)
    } else {
      result = await updateShift(data)
    }
    if (result) {
      console.log('success with shift: ', result)
    }

    formikBag.resetForm()
    setOpen(false)
  }

  // React.useEffect(() => {
  //   console.log('This is the selected shift', shift)
  // }, [shift])

  return (
    <>
      <Formik
        validationSchema={ShiftSchema}
        initialValues={{
          name: shift ? shift.name : emptyShift.name,
          category: shift ? shift.category : emptyShift.category,
          hours: shift ? shift.hours : emptyShift.hours,
          startTime: shift
            ? dayjs(shift.timeWindow.startTime.toString(), 'HHmm')
            : emptyShift.startTime,
          endTime: shift
            ? dayjs(shift.timeWindow.endTime.toString(), 'HHmm')
            : emptyShift.endTime,
          possibleDays: shift
            ? shift.possibleDays
              ? shift.possibleDays
              : []
            : emptyShift.possibleDays,
          description: shift ? shift.description : emptyShift.despription,
          verificationBuffer: shift
            ? shift.verificationBuffer
            : emptyShift.verificationBuffer,
          assignedUser: shift ? shift.assignedUser : emptyShift.assignedUser,
          assignedDay: shift ? shift.assignedDay : emptyShift.assignedDay,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <TextInput name="name" label="Shift Name" />

            <SelectInput
              name="category"
              label="Category"
              labelid="category"
              id="category"
              options={houseCategories}
              multiselect={false}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                label="Start Window Time"
                minutesStep={30}
                value={values.startTime}
                onChange={(newValue) => setFieldValue('startTime', newValue)}
              />
              <MobileTimePicker
                label="End Window Time"
                minutesStep={30}
                value={values.endTime}
                onChange={(newValue) => {
                  setFieldValue('endTime', newValue)
                }}
              />
            </LocalizationProvider>

            <TextInput name="hours" label="Credit Hours For Shift" />

            <TextInput name="verificationBuffer" label="Buffer Hours" />

            <SelectInput
              name="possibleDays"
              label="Posible Days"
              labelid="possibleDays"
              id="possibleDays"
              options={daysList}
              multiselect={true}
            />

            <TextInput name="description" label="Description" />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isNewShift || !shiftId ? 'Submit' : 'Update'}
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
    </>
  )
}

export default ShiftForm
