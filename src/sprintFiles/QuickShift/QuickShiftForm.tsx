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
  assignedDay: Yup.string(),

  assignedUser: Yup.object(), //reassign the assignedUser
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
  assignedUser: { label: '', id: '' },
  assignedDay: dayjs(),
}

/**
 * 1. Fill out the quick shift form like a shift form
 * 2. Formik uses validation schema + setField value to track form changes
 * 3. For any option, setFieldValue, TextField, and other formik components/funcs will update initialValues
 * 4. When submit is pressed, initialValues is sent to onSubmit function.
 * 5. onSubmit function accesses the field values from formik.  Can manipulate as wanted
 * 6. OnSubmit formats the field info to match a scheduled shift.  Sends it to firebase
 */

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
    addNewScheduledShift,
    {
      // isLoading: isLoadingNewShift,
      // isSuccess: isSuccessNewShift,
      // isError: isErrorNewShift,
      // error: errorNewShift,
    },
  ] = useAddNewScheduledShiftMutation()
  const [
    updateScheduledShift,
    {
      // isLoading: isLoadingUpdateShift,
      // isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateScheduledShiftMutation()

  const [chosenDate, setDate] = useState<dayjs.Dayjs | null>(null)

  /**
   *
   * Has part of the data formatted into JSONcopy, which is what the original shift should've looked like
   * Note that JSONCopy won't match a Shift object in our firebase like a regular scheduled shift would
   * Rest of info is stored in a defaulted scheduledShift.  Bare min. info to fit a quickshift.
   *
   */
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

      assignedDay: Dayjs
      assignedUser: labeledUser | undefined
    },
    formikBag: FormikHelpers<any>
  ) => {
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
    } = values

    const startTime = Number(startTimeObject.format('HHmm'))
    const endTime = Number(endTimeObject.format('HHmm'))
    let category
    if (categoryString === undefined || categoryString === 'Uncategorized') {
      category = ''
    } else {
      category = categoryString
    }

    let result
    const timeWindow = { startTime, endTime }
    const timeWindowDisplay =
      formatMilitaryTime(startTime) + ' - ' + formatMilitaryTime(endTime)
    const data = { data: {}, houseId: '', shiftId: '' }
    const shiftObject = {
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

    data.data = {
      id: '',
      shiftID: '',
      date: assignedDay.toString(),
      assignedUser: assignedUser,
      status: 'live',
      verifiedBy: '',
      verifiedAt: '',
      unverifiedAt: '',
      penaltyHours: 0,
      jsonCopy: JSON.stringify(shiftObject), //TODO : check if this fails
    }

    data.houseId = currentHouse.id
    data.shiftId = shiftId ? shiftId : ''
    // console.log('data: ', data)
    console.log({
      pushedData: data,
      datadata: data.data,
      isNewShift: isNewShift,
      shiftId: shiftId,
    })

    if (isNewShift || !shiftId) {
      result = await addNewScheduledShift(data)
    } else {
      result = await updateScheduledShift(data)
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
  const [userOptions, setUserOptions] = useState([{ label: '', id: '' }])
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
      emptyShift.assignedUser = tempOptions[0]
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
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setFieldValue, errors }) => {
          return (
            <Form>
              <TextInput name="name" label="Shift Name" />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={values.assignedDay}
                  onChange={(newValue) =>
                    setFieldValue('assignedDay', newValue)
                  }
                />
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
                    console.log({ newValue: newValue })
                    setFieldValue('assignedUser', newValue)
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
