import React, { useEffect, useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import { capitalizeFirstLetter } from '../../../utils/utils'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import dayjs from 'dayjs'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import { Table, TableBody, Typography } from '@mui/material'
import uuid from 'react-uuid'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectMemberAvailability,
  setMemberAvailabilityDay,
} from '../usersSlice'
import { User } from '@/types/schema'

type AvailabilitiesProps = {
  // dayAvailability: { startTime: string; endTime: string }[]
  day: string
  isEditing: boolean
  
}

const generateTimeOptions = () => {
  // const options = []
  let options = {}
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const timeValue = dayjs().hour(i).minute(j).format('h:mm A')
      const timeKey = dayjs().hour(i).minute(j).format('HHmm')
      // console.log(timeKey, timeValue)
      options = { ...options, [timeKey]: timeValue }
      // options.push(time)
    }
  }

  options = { ...options, ['2359']: '11:59 PM' }
  return options
}

const generateTimeOptionsIndex = () => {
  let options = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const timeKey = dayjs().hour(i).minute(j).format('HHmm')
      // console.log(timeKey, timeValue)
      options.push(timeKey)
      // options.push(time)
    }
  }
  options.push('2359')
  return options
}

const AvailabilityItem: React.FC<AvailabilitiesProps> = ({
  // dayAvailability,
  day,
  isEditing,
  
}) => {
  const [editedAvailability, setEditedAvailability] = useState<
    { startTime: string; endTime: string }[]
  >([])

  const [dayAvailability, setDayAvailability] = useState<
    { startTime: string; endTime: string }[]
  >([])

  const timeOtions = generateTimeOptions()
  const timeIndex = generateTimeOptionsIndex()

  //** get the dispatch hook to dispatch the availability update state */
  const dispatch = useDispatch()

  //** Get the availability from redux state. This should be updated when the user navegates to the availability tab */
  const availability = useSelector(selectMemberAvailability)

  function handleSelectChange(
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) {
    const newValue = event.target.value
  }
  const handleTimeChange = (id: string, startTime: string, endTime: string) => {
    console.log(id, startTime, endTime)
    const weekDay = id.split('-')[0]
    const index = parseInt(id.split('-')[1], 10)

    const newEditedAvailability = [
      ...availability[day as keyof typeof availability],
    ] as Array<{
      startTime: string
      endTime: string
    }> // create a new copy of the array

    if (dayAvailability.length > index) {
      newEditedAvailability[index] = { startTime, endTime }
    } else {
      newEditedAvailability.push({ startTime, endTime })
    }

    dispatch(
      setMemberAvailabilityDay({ day, availabilityDay: newEditedAvailability })
    )

    // setEditedAvailability(newEditedAvailability) // update the state with the new copy of the array
    // onAvailabilityChange(newEditedAvailability, day)
  }

  const handleAddTimeBlock = () => {
    const newEditedAvailability = [
      ...availability[day as keyof typeof availability],
    ] as Array<{
      startTime: string
      endTime: string
    }>
    newEditedAvailability.push({
      startTime: timeIndex[10],
      endTime: timeIndex[11],
    })
    dispatch(
      setMemberAvailabilityDay({ day, availabilityDay: newEditedAvailability })
    )
  }

  useEffect(() => {
    if (availability) {
      setDayAvailability(availability[day as keyof typeof availability])
    }
  }, [availability])

  return (
    <React.Fragment>
      <TableRow sx={{ borderBottom: 'none' }}>
        <TableCell component="th" id={day} scope="row" align={'left'}>
          <Typography>{capitalizeFirstLetter(day)}</Typography>
        </TableCell>

        <TableCell component="th" scope="row" align={'left'}>
          <Table>
            <TableBody>
              {availability && availability[day as keyof typeof availability]
                ? availability[day as keyof typeof availability].map(
                    ({ startTime, endTime }, index) => {
                      return (
                        <AvailabilityForm
                          key={day + '-' + index}
                          startTime={startTime}
                          endTime={endTime}
                          id={day + '-' + index}
                          isEditing={isEditing}
                          onTimeChange={handleTimeChange}
                        />
                      )
                    }
                  )
                : null}
            </TableBody>
          </Table>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <IconButton onClick={handleAddTimeBlock}>
              <AddIcon />
            </IconButton>
          ) : null}
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default AvailabilityItem

type AvailabilityFormProps = {
  startTime: string
  endTime: string
  id: string
  isEditing: boolean
  onTimeChange: (id: string, startTime: string, endTime: string) => void
}

type TimeOptions = {
  [key: string]: string
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  startTime,
  endTime,
  id,
  isEditing,
  onTimeChange,
}) => {
  const timeOptions: TimeOptions = generateTimeOptions()
  const timeOptionsIndex: string[] = generateTimeOptionsIndex()
  const [editedStartTime, setEditedStartTime] = useState(startTime)
  const [editedEndTime, setEditedEndTime] = useState(endTime)
  const availability = useSelector(selectMemberAvailability)
  const dispatch = useDispatch()

  const handleDeleteTimeBlock = () => {
    const weekDay = id.split('-')[0]
    const index = parseInt(id.split('-')[1], 10)

    const dayAvailability = [
      ...availability[weekDay as keyof typeof availability],
    ]
    dayAvailability.splice(index, 1)
    dispatch(
      setMemberAvailabilityDay({
        day: weekDay,
        availabilityDay: dayAvailability,
      })
    )
  }

  const form = (
    <TableRow key={id} sx={{ borderBottom: 'none' }}>
      <TableCell
        component="th"
        scope="row"
        align={'left'}
        sx={{ borderBottom: 'none' }}
      >
        <Box display={'flex'} flexDirection={'row'}>
          <Box>
            <FormControl>
              <InputLabel id="start-time-label">From</InputLabel>
              <Select
                labelId="start-time-label"
                id="start-time-select"
                value={editedStartTime}
                onChange={(event) => {
                  setEditedStartTime(event.target.value)
                  onTimeChange(id, event.target.value, editedEndTime)
                }}
                label="Start Time"
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  PaperProps: {
                    style: {
                      maxHeight: 300, // set the max height of the menu
                      width: 200, // set the width of the menu
                    },
                  },
                }}
              >
                {timeOptionsIndex.map((time) => (
                  <MenuItem key={time} value={time}>
                    {timeOptions[time]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <InputLabel id="end-time-label">To</InputLabel>
              <Select
                labelId="end-time-label"
                id="end-time-select"
                value={editedEndTime}
                onChange={(event) => {
                  setEditedEndTime(event.target.value)
                  onTimeChange(id, editedStartTime, event.target.value)
                }}
                label="End Time"
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  PaperProps: {
                    style: {
                      maxHeight: 300, // set the max height of the menu
                      width: 200, // set the width of the menu
                    },
                  },
                }}
              >
                {timeOptionsIndex.map((time) => (
                  <MenuItem key={time} value={time}>
                    {timeOptions[time]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <IconButton onClick={(id) => handleDeleteTimeBlock()}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  )

  const display = (
    <TableRow key={id} sx={{ borderBottom: 'none' }}>
      <TableCell
        component="th"
        scope="row"
        align={'left'}
        sx={{ borderBottom: 'none' }}
      >
        {`${timeOptions[startTime]} - ${timeOptions[endTime]}`}
      </TableCell>
    </TableRow>
  )

  return <React.Fragment>{isEditing ? form : display}</React.Fragment>
}
