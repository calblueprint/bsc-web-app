import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Button, Box, TextField } from '@mui/material'
import { ScheduledShift } from '@/types/schema'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// Use the ISO week plugin
dayjs.extend(isoWeek)

// // Assuming Shift type is something like this
// interface Shift {
//   id: string
//   date: string // the date is now a string
// }

interface WorkShiftsByWeekProps {
  shifts: ScheduledShift[]
}

const WorkShiftsByWeek: React.FC<WorkShiftsByWeekProps> = ({ shifts }) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs())
  const [filteredShiftIds, setFilteredShiftIds] = useState<string[]>([])

  useEffect(() => {
    if (selectedDate) {
      filterShifts(selectedDate)
    }
  }, [selectedDate])

  const filterShifts = (date: dayjs.Dayjs) => {
    const shiftsThisWeek = shifts?.filter(
      (shift) => dayjs(shift.date, 'MM/DD/YYYY').isoWeek() === date.isoWeek()
    )
    setFilteredShiftIds(shiftsThisWeek.map((shift) => shift.id))
  }

  const handleWeekChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(dayjs(date))
    }
  }

  const shiftWeek = (numWeeks: number) => {
    if (selectedDate) {
      setSelectedDate(selectedDate.add(numWeeks, 'week'))
    }
  }

  const weekRangeString = selectedDate
    ? `${selectedDate.startOf('isoWeek').format('MMMM D')} - ${selectedDate
        .endOf('isoWeek')
        .format('MMMM D')}`
    : ''

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Button onClick={() => shiftWeek(-1)}>&lt;</Button>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <DatePicker
            label="Week"
            value={selectedDate || dayjs()}
            onChange={handleWeekChange}
          /> */}
        </LocalizationProvider>
      </Box>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Week"
          value={selectedDate?.toDate()}
          onChange={handleWeekChange}
        />
      </LocalizationProvider> */}
      <Button onClick={() => shiftWeek(1)}>&gt;</Button>
    </Box>
  )
}

export default WorkShiftsByWeek
