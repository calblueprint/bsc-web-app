// use this to test your stuff
// NOTE: must be logged in as a manager to use this testing page

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { Typography } from '@mui/material'
import ShiftInfoHeader from '@/components/shared/shiftCardHeader/ShiftInfoHeader'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'

const TestingPage = () => {
  const { data } = useGetShiftsQuery('EUC')

  // useEffect(() => {
  //   console.log('Data Ids: ', data?.ids)
  // }, [data])

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
    </React.Fragment>
  )
}
export default TestingPage
