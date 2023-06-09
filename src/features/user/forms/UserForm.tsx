import { Formik, Form, FormikHelpers, FormikValues } from 'formik'
import { Button, Typography } from '@mui/material'
import * as Yup from 'yup'
import { TextInput } from '@/components/shared/forms/CustomFormikFields'
import {
  selectUserById,
  useAddNewUserMutation,
  useUpdateUserMutation,
} from '../userApiSlice'
import { useSelector } from 'react-redux'
import React from 'react'
import { RootState } from '../../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { User } from '../../../types/schema'
import { darkButton } from '@/assets/StyleGuide'
import styles from './UserForm.module.css'
import { selectCurrentUser } from '@/features/auth/authSlice'
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth'
import { auth } from '@/firebase/clientApp'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const UserSchema = Yup.object({
  firstName: Yup.string(),
  lastName: Yup.string(),
  displayName: Yup.string().required('Display Name is required'),
  email: Yup.string(),
  roles: Yup.array().of(Yup.string()),
  houseID: Yup.string(),
  hoursAssigned: Yup.number(),
  pinNumber: Yup.number(),
  assignedScheduledShifts: Yup.array().of(Yup.string()),
  weekMissedHours: Yup.number(),
  weekPenaltyHours: Yup.number(),
  runningTotalMissedHours: Yup.number(),
  runningTotalPenatlyHours: Yup.number(),
  currentPassword: Yup.string(),
  newPassword: Yup.string(),
  confirmPassword: Yup.string(),
})

const emptyUser = {
  // Role of the user
  roles: [],
  // Last Name
  lastName: '',
  // First Name
  firstName: '',
  // full name that gets displayed
  displayName: '',
  // User email
  email: '',
  // The houseID of the house that the user resides in
  houseID: '',
  // Hours the user has been assigned
  hoursAssigned: 0,
  // Hours the user must be assigned, always set to 5

  // Pin Number for verifying other people's tasks
  pinNumber: 0,
  // Total fines assessed to this user

  // Map of availabilities (day: time windows when they're free)
  //   availabilities: { string: number[] }
  // Map of preferences (taskID: (0/1/2 (higher number = greater preference)))
  //   preferences: { string: number }

  //** new attributes below */

  // The scheduled shifts that the user has been assigned
  assignedScheduledShifts: [],
  // Missed workshift hours this user has missed this current week
  weekMissedHours: 0,
  // Hours that manager has added to this user as a penatly for missing a shift this current week
  weekPenaltyHours: '',
  // The running total of missed workshift hours for the whole semester
  runningTotalMissedHours: '',
  // The running total of penalty hours for the whole semester
  runningTotalPenatlyHours: '',
}

const UserForm = ({
  setOpen,
  userId,
  isNewUser,
  editType,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  userId?: string
  isNewUser: boolean
  editType?: string
}) => {
  //* Get API helpers to create or update a user
  const [
    addNewUser,
    {
      // isLoading: isLoadingNewUser,
      // isSuccess: isSuccessNewUser,
      // isError: isErrorNewUser,
      // error: errorNewUser,
    },
  ] = useAddNewUserMutation()
  const [
    updateUser,
    {
      // isLoading: isLoadingUpdateUser,
      // isSuccess: isSuccessUpdateUser,
      // isError: isErrorUpdateUser,
      // error: errorUpdateUser,
    },
  ] = useUpdateUserMutation()
  const [EstablishContext, {}] = useEstablishContextMutation()

  let user: User = useSelector(
    (state: RootState) => selectUserById(state, userId as EntityId) as User
  )
  const currUser = useSelector(selectCurrentUser) as User

  if (editType != 'Information') {
    user = currUser
  }
  const auth = getAuth()

  const onSubmit = async (
    values: FormikValues,
    formikBag: FormikHelpers<any>
  ) => {
    const {
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    } = values
    const data = { data: {}, houseId: '', userId: '' }
    // console.log('auth', auth.currentUser)
    if (editType === 'Password' && auth.currentUser) {
      if (newPassword === confirmPassword) {
        var credential = EmailAuthProvider.credential(email, currentPassword)
        reauthenticateWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser) {
              updatePassword(auth.currentUser, newPassword).catch((error) => {
                console.log('password update unsuccessful')
              })
            }
          })
          .catch((error) => {
            console.log('wrong password')
          })
      } else {
        console.log("passwords don't match")
      }
    }
    let result
    const displayName = firstName + ' ' + lastName

    data.data = {
      firstName,
      lastName,
      displayName,
      email,
    }
    data.houseId = user.houseID ? user.houseID : 'EUC'
    data.userId = user.id ? user.id : ''
    // console.log('form ', userId)
    if (isNewUser || !userId) {
      result = await addNewUser(data)
    } else {
      result = await updateUser(data)
      if (editType != 'Information') {
        EstablishContext(user.id)
      }
    }
    if (result) {
      console.log('success with user: ', result)
    }

    formikBag.resetForm()
    setOpen(false)
  }

  return (
    <>
      <Formik
        validationSchema={UserSchema}
        initialValues={{
          firstName: user ? user.firstName : emptyUser.firstName,
          lastName: user ? user.lastName : emptyUser.lastName,
          displayName: user ? user.displayName : emptyUser.displayName,
          email: user ? user.email : emptyUser.email,
          roles: user ? user.roles : emptyUser.roles,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {editType === 'Name' || editType === 'Information' ? (
              <div className={styles.flex}>
                <div className={styles.formField}>
                  <Typography>First Name</Typography>
                  <TextInput name="firstName" label="" />
                </div>
                <div className={styles.formField}>
                  <Typography>Last Name</Typography>
                  <TextInput name="lastName" label="" />
                </div>
              </div>
            ) : (
              <div />
            )}
            {editType === 'Email' || editType === 'Information' ? (
              <div className={styles.formField}>
                <Typography>Email</Typography>
                <TextInput name="email" label="" />
              </div>
            ) : (
              <div />
            )}
            {editType === 'Password' ? (
              <div className={styles.formField}>
                <Typography>Current Password</Typography>
                <TextInput name="currentPassword" label="" />
                <Typography>New Password</Typography>
                <TextInput name="newPassword" label="" />
                <Typography>Confirm New Password</Typography>
                <TextInput name="confirmPassword" label="" />
              </div>
            ) : (
              <div />
            )}
            <div className={styles.submit}>
              <Button
                type="submit"
                sx={darkButton}
                color="primary"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default UserForm
