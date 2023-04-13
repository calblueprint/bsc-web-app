// use this to test your stuff
// NOTE: must be logged in as a manager to use this testing page

import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { Typography } from '@mui/material'

const TestingPage = () => {
  const authUser = useSelector(selectCurrentUser)
  console.log(authUser)

  return (
    <React.Fragment>
      <Typography>Test test test</Typography>
    </React.Fragment>
  )
}
export default TestingPage
