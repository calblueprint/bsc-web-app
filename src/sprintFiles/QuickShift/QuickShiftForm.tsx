import { Formik, Form, FormikHelpers, Field } from 'formik'
import {
  Stack,
  Button,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import dayjs, { Dayjs } from 'dayjs'
import * as Yup from 'yup'
import {
  TextInput,
  SelectInput,
} from '../../components/shared/forms/CustomFormikFields'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { RootState } from '../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { House, ScheduledShift, Shift, User } from '../../types/schema'
import styles from './ShiftForm.module.css'
import {
  selectScheduledShiftById,
  useAddNewScheduledShiftMutation,
  useUpdateScheduledShiftMutation,
} from './scheduledShiftApiSlice'
import {
  selectShiftById,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
} from '@/features/shift/shiftApiSlice'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import uuid from 'react-uuid'
import { formatMilitaryTime } from '@/utils/utils'

//TODO: NOTE FROM ANDREI - scheduledshift objects are referred to as shifts in this file.  Too many random changes if we rename it to scheduledShifts.

//TODO: Greg wants scheduled shift objects to hold a shift copy within themselves.  Have it be saved as string in FB, as Shift in-browser.
//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. *
//Todo: Needs a calendar. QUick shifts have a specific person, specific date.
//TODO: members panel will become a dropdown
//Todo: search bar needs 100% match right now, implement reactive soon.
const ShiftSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  description: Yup.string(),
  possibleDays: Yup.array().of(Yup.string()),
  startTime: Yup.date().required('Start time is required'),
  endTime: Yup.date().required('End time is required'),
  // category: Yup.string().required('Cagegory is required'),
  hours: Yup.number().required('Hours credit is required'),
  verificationBuffer: Yup.number(),
  assignedUser: Yup.string(), //unsure what this did in the original shift.
  assignedDay: Yup.string(),

  member: Yup.object(),
  date: Yup.date(),
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

const QuickShiftForm = ({
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

  const [chosenDate, setDate] = useState<dayjs.Dayjs | null>(null)

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
      member: string
      targetUser: labeledUser
    },
    formikBag: FormikHelpers<any>
  ) => {
    console.log('submitting')
    console.log('Submiting ShiftForm: ', values)
    const {
      name,
      category: categoryString,
      hours,
      description,
      possibleDays,
      startTime: startTimeObject,
      endTime: endTimeObject,
      verificationBuffer,
      assignedUser,
      assignedDay,
      member,
      targetUser,
    } = values
    console.log({ afterwards: values })

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
    const id = uuid()
    const timeWindowDisplay =
      formatMilitaryTime(startTime) + ' - ' + formatMilitaryTime(endTime)
    const data = { data: {}, houseId: '', shiftId: '' }
    data.data = {
      id: id,
      date: chosenDate,
      assignedUser: targetUser?.id,
      status: 'live',
      verifiedBy: '',
      verifiedAt: '',
      unverifiedAt: '',
      penaltyHours: 0,
    }
    data.houseId = currentHouse.id
    data.shiftId = id ? id : ''
    // console.log('data: ', data)
    console.log({ formdata: data, formdatadta: data.data })
    if (isNewShift || !shiftId) {
      result = await useAddNewScheduledShiftMutation(data)
    } else {
      result = await useUpdateScheduledShiftMutation(data)
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

  const {
    data: users,
    // isLoading: isUsersLoading,
    // isSuccess: isUsersSuccess,
    // isError: isUsersError,
  } = useGetUsersQuery({})

  //Using this instead of setFieldValue in formik because of issues with the fields
  //Will use the specific date that a quick shift must be in.
  const [userOptions, setUserOptions] = useState(['', 'a', 'b', 'c', 'd'])
  type labeledUser = {
    label: string
    id: String
  }
  const [targetUser, setTargetUser] = useState<labeledUser>(userOptions[0])

  useEffect(() => {
    // console.log({ ents: users?.entities, ids: users?.ids, targuser: targetUser, userOpt: Val: inputValue})
    {
      const tempOptions = []
      if (users == undefined) return
      users.ids?.map((id: EntityId) => {
        let user = users?.entities[id]
        if (user != undefined) {
          let userWithLabel = {
            label: user.displayName,
            id: user.id,
          } //TODO: add an ID here as well.
          // Object.assign(userWithLabel, user)
          tempOptions.push(userWithLabel)
        }
      })
      setUserOptions(tempOptions)
      setTargetUser(tempOptions[0])
    }
    console.log('OPTIONS: ', { options: userOptions })
  }, [users])
  const [inputValue, setInputValue] = React.useState('')
  /**
   * 1. load in the options, push the labeled options to a user options list
   * 2. use the userOptions to create the members list
   * 3. treat the form like a normal shift form.  Except:  Categories, assignedUser, possible days will be set to defaults.
   * 4. when picking an option from the dropdown, change the member OBJECT to match
   * 5.
   */

  return (
    <>
      <Formik
        validationSchema={ShiftSchema}
        initialValues={{
          name: shift ? shift.name : emptyShift.name,
          // category: shift ? shift.category : emptyShift.category,
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
          member: { label: '', id: '' },
          memberId: '',
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setFieldValue, errors }) => {
          return (
            <Form>
              <TextInput name="name" label="Shift Name" />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker value={chosenDate} onChange={(e) => setDate(e)} />
              </LocalizationProvider>
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
              {targetUser != undefined ? (
                <Autocomplete
                  disablePortal
                  name="member"
                  options={userOptions}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="member" />
                  )}
                  value={undefined}
                  // onChange={(e) => {
                  //   setTargetUser(e)
                  // }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                  }}
                  onChange={(event: any, newValue: labeledUser) => {
                    setFieldValue('member', newValue)
                  }}
                />
              ) : null}

              <TextInput name="hours" label="Value" />

              <TextInput name="verificationBuffer" label="Buffer Hours" />

              <TextInput name="description" label="Description" />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  // disabled={isSubmitting}
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
          )
        }}
      </Formik>
    </>
  )
}

export default QuickShiftForm
