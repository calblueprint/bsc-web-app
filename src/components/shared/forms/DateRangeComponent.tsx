//** Hooks */
import React, { useEffect } from 'react'

//** Materials UI Components */

import Box from '@mui/material/Box'
import { Table, TableBody, Typography } from '@mui/material'

//** Redux state selectors and setters */

import { User } from '@/types/schema'
import { FormikErrors } from 'formik'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

type DateRangeComponentProps = {
  startDateValue: dayjs.Dayjs
  endDateValue: dayjs.Dayjs
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
  setError: (value: boolean) => void
}
const DateRangeComponent = (props: DateRangeComponentProps) => {
  const { startDateValue, endDateValue, setFieldValue, setError } = props

  const isInvalidRange = startDateValue.isAfter(endDateValue)

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
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{ marginY: 2, marginRight: 2 }}
      >
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDateValue}
              onChange={(newValue) => setFieldValue('startDate', newValue)}
            />

            <DatePicker
              label="End Date"
              sx={{ marginLeft: 1 }}
              value={endDateValue}
              onChange={(newValue) => setFieldValue('endDate', newValue)}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          {isInvalidRange ? (
            <Typography color="error" variant="caption">
              {`Invalid time range.`}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {/* <Box
        display={'flex'}
        flexDirection={'row'}
        sx={{ marginY: 2, marginRight: 2 }}
      >
        <Box sx={{ marginRight: 2 }}>
          <Typography>Start Date</Typography>
          <DateSelectField
            fieldId="start-time-select"
            labelId="start-time-label"
            label=""
            value={startDateValue}
            handleOnChange={(newValue) => {
              console.log('newValue', newValue.target.value)
              setFieldValue('startDate', newValue.target.value)
            }}
          />
        </Box>

        <Box>
          <Typography>End Date</Typography>
          <DateSelectField
            fieldId="end-time-select"
            labelId="end-time-label"
            label=""
            value={endDateValue}
            handleOnChange={(newValue) => {
              console.log('newValue', newValue.target.value)
              setFieldValue('endDate', newValue.target.value)
            }}
          />
        </Box>
      </Box>

      {isInvalidRange ? (
        <Typography color="error" variant="caption">
          {`Invalid time range.`}
        </Typography>
      ) : null} */}
    </React.Fragment>
  )

  return <React.Fragment>{form}</React.Fragment>
}

export default DateRangeComponent
