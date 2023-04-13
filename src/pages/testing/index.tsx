// use this to test your stuff
// NOTE: must be logged in as a manager to use this testing page

import React, { useEffect } from 'react'
import PrivateLayout from '../Layout'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentRole,
  selectCurrentUser,
  setCurrentRole,
} from '@/features/auth/authSlice'
import Loading from '@/components/shared/Loading'
import { useRouter } from 'next/router'
import { Typography } from '@mui/material'

const index = () => {
  const authUser = useSelector(selectCurrentUser)
  const currentRole = useSelector(selectCurrentRole)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (authUser) {
      if (!authUser.roles?.includes('manager')) {
        console.log('No managers here *********')
        dispatch(setCurrentRole(''))
        router.replace('/')
      } else {
        if (!currentRole) {
          dispatch(setCurrentRole('manager'))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, currentRole])

  let content = <Typography>Test test test</Typography>

  return (
    <React.Fragment>
      {currentRole && authUser ? (
        <PrivateLayout>{content}</PrivateLayout>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  )
}
export default index
