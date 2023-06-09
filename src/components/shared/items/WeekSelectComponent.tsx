import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

import dayjs, { Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import React, { useEffect, useState } from 'react'
import Popover from '@mui/material/Popover'
import { PickerSelectionState } from '@mui/x-date-pickers/internals'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectWeekDateSelected,
  selectWeekNumberSelected,
  setWeekDateSelected,
  setWeekNumberSelected,
} from '@/features/scheduledShift/scheduledShiftSlice'

// Use the ISO week plugin
dayjs.extend(isoWeek)
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

const WeekSelectComponent = () => {
  const weekDate = useSelector(selectWeekDateSelected)
  const [selectedWeekDisplay, setSelectedWeekDisplay] = useState('Week')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(weekDate, 'MM/DD/YYYY')
  )
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const dispatch = useDispatch()

  const shiftWeek = (numWeeks: number) => {
    if (selectedDate) {
      setSelectedDate(selectedDate.add(numWeeks, 'week'))
      dispatch(
        setWeekDateSelected(
          selectedDate.add(numWeeks, 'week').format('MM/DD/YYYY')
        )
      )
    }
  }
  const handleWeekChange = (
    value: Dayjs | null,
    selectionState?: PickerSelectionState | undefined
  ) => {
    // console.log('handleWeekChange: value: ' + value)
    // console.log('handleWeekChange: selectionState ' + selectionState)
    if (selectionState === 'finish' && value) {
      setSelectedDate(value)
      dispatch(setWeekDateSelected(value.format('MM/DD/YYYY')))
      handleClose()
    }
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  useEffect(() => {
    if (selectedDate) {
      const weekRangeString = selectedDate
        ? `${selectedDate
            .startOf('week')

            .format('MMM D')} - ${selectedDate
            .endOf('week')

            .format('MMM D')}`
        : ''

      setSelectedWeekDisplay(weekRangeString)
    }
  }, [selectedDate])
  return (
    <React.Fragment>
      <Box>
        <IconButton onClick={() => shiftWeek(-1)}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
          {selectedWeekDisplay}
        </Button>

        <IconButton onClick={() => shiftWeek(1)}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            displayWeekNumber
            value={selectedDate}
            onChange={handleWeekChange}
          />
        </LocalizationProvider>
      </Popover>
    </React.Fragment>
  )
}

export default WeekSelectComponent
