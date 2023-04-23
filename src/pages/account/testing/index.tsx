// use this to test your stuff
// NOTE: must be logged in as a manager to use this testing page

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { Typography } from '@mui/material'
import { useGetAuthorizedUsersQuery } from '@/features/authorizedUser/authorizedUserApiSlice'

const TestingPage = () => {
  const authUser = useSelector(selectCurrentUser)
  const { data: authHouseUsersData } = useGetAuthorizedUsersQuery('EUC')
  console.log(authUser)

  useEffect(() => {
    if (authHouseUsersData) {
      console.log(authHouseUsersData)
    }
  }, [authHouseUsersData])

  return (
    <React.Fragment>
      <Typography>Test test test</Typography>
    </React.Fragment>
  )
}
export default TestingPage
