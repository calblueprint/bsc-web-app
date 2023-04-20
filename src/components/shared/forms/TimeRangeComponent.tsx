//** Hooks */
import React, { useEffect } from 'react'

//** Materials UI Components */

import Box from '@mui/material/Box'
import { Table, TableBody, Typography } from '@mui/material'

//** Redux state selectors and setters */

import { User } from '@/types/schema'
import TimeSelectField from './TimeSelectField'
import { FormikErrors } from 'formik'

type TimeRangeComponentProps = {
  startTimeValue: string
  endTimeValue: string
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
  setError: (value: boolean) => void
}
const TimeRangeComponent = (props: TimeRangeComponentProps) => {
  const { startTimeValue, endTimeValue, setFieldValue, setError } = props

  const isInvalidRange = parseInt(startTimeValue) >= parseInt(endTimeValue)

  useEffect(() => {
    if (isInvalidRange) {
      setError(true)
    } else {
      setError(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInvalidRange])

  const form = (
    <React.Fragment>
      <Box display={'flex'} flexDirection={'row'}>
        <TimeSelectField
          fieldId="start-time-select"
          labelId="start-time-label"
          label="Start Time"
          value={startTimeValue}
          handleOnChange={(newValue) => {
            console.log('newValue', newValue.target.value)
            setFieldValue('startTime', newValue.target.value)
          }}
        />
        <TimeSelectField
          fieldId="end-time-select"
          labelId="end-time-label"
          label="End Time"
          value={endTimeValue}
          handleOnChange={(newValue) => {
            console.log('newValue', newValue.target.value)
            setFieldValue('endTime', newValue.target.value)
          }}
        />
      </Box>

      {isInvalidRange ? (
        <Typography color="error" variant="caption">
          {`Invalid time range.`}
        </Typography>
      ) : null}
    </React.Fragment>
  )

  return <React.Fragment>{form}</React.Fragment>
}

export default TimeRangeComponent
