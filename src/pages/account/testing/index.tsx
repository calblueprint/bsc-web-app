// use this to test your stuff
// NOTE: must be logged in as a manager to use this testing page

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { Typography } from '@mui/material'
import { useGetHouseAuthorizedUsersQuery } from '@/features/authorizedUser/authorizedUserApiSlice'
import ShiftInfoHeader from '@/components/shared/shiftCardHeader/ShiftInfoHeader'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import ScheduleShiftForm from '@/features/scheduledShift/testing/scheduleShiftForm'
import { useGetHouseUsersQuery } from '@/features/user/userApiSlice'

const TestingPage = () => {
  const authUser = useSelector(selectCurrentUser)
  const { data: authHouseUsersData } = useGetHouseAuthorizedUsersQuery('CLO')
  const { data: houseUsers } = useGetHouseUsersQuery('EUC')
  // console.log(authUser)

  useEffect(() => {
    // console.log('Auth User', authHouseUsersData)
    if (authHouseUsersData) {
      console.log('Auth User', authHouseUsersData)
    }
  }, [authHouseUsersData])
  useEffect(() => {
    if (houseUsers) {
      console.log('User', houseUsers)
    }
  }, [houseUsers])

  /**
   *  Here is an example of how I tested my ShiftInfoHeader component.
   *  Feel free to delete whatever here and replace with what you want to test!
   */

  // I query the data that I need to use in my component here, cuz I use
  // the useSelctor in my component, but for that to work, Redux needs to
  // have cached the data firt
  const { data } = useGetShiftsQuery('EUC')

  // Notice that I first check that data is not null because it takes a
  // minute for Firebase and Redux to actually give us the data
  return (
    <React.Fragment>
      <Typography>Test test test</Typography>
      {data ? (
        <ShiftInfoHeader
          shiftId={'1uCJCE9ePRnv4bMDEDRu'}
          selectedDay="Friday"
          handleClose={() => console.log('CLOOOOOSE')}
        />
      ) : null}
      <ScheduleShiftForm />
    </React.Fragment>
  )
}
export default TestingPage
