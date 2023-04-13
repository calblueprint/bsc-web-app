//** Hooks */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//** Materials UI Components */
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import { Table, TableBody, Typography } from '@mui/material'

//** Custom Functions */
import {
  capitalizeFirstLetter,
  generateTimeOptions,
  generateTimeOptionsIndex,
  isTimeOverlap,
} from '../../../utils/utils'

//** Redux state selectors and setters */
import {
  selectMemberAvailability,
  // setDeleteInvalid,
  // setDeleteOverlap,
  setIsAvailabilityError,
  setIsInvalid,
  setIsOverlap,
  setMemberAvailabilityDay,
  // setResetStateError,
} from '../../userAvailability/userAvailabilitySlice'
import { User } from '@/types/schema'

//** Custom Types */
type AvailabilitiesProps = {
  day: string
  isEditing: boolean
}

/**
 *
 * @param day:string name of the weekday for the availability so edit/display
 *
 * @param isEditing:boolean True if user is editing the availability
 *
 * @returns React.FC that either displays the availability or a form to edit the availability
 */
const AvailabilityItem: React.FC<AvailabilitiesProps> = ({
  day,
  isEditing,
}) => {
  //** Get the availability from redux state. This should be updated when the user navegates to the availability tab */
  const userAvailability = useSelector(
    selectMemberAvailability
  ) as User['availabilities']

  //** array of indexes to access the timeOptions object */
  const timeIndex = generateTimeOptionsIndex()

  //** Hooks */
  const dispatch = useDispatch()

  //** Add a new block of time to a day */
  const handleAddTimeBlock = () => {
    const newEditedAvailability = [
      ...userAvailability[day as keyof typeof userAvailability],
    ] as Array<{
      startTime: string
      endTime: string
    }>

    const len = newEditedAvailability.length
    let blockTimeIndex = timeIndex.indexOf('0600')
    if (len > 0) {
      const lastBlockTime = newEditedAvailability[len - 1].endTime
      blockTimeIndex = timeIndex.indexOf(lastBlockTime)
    }
    if (blockTimeIndex > timeIndex.length - 5) {
      blockTimeIndex = timeIndex.length - 5
    }

    // console.log('getTime: ' + timeIndex[blockTimeIndex])

    newEditedAvailability.push({
      startTime: timeIndex[blockTimeIndex + 2],
      endTime: timeIndex[blockTimeIndex + 4],
    })
    dispatch(
      setMemberAvailabilityDay({ day, availabilityDay: newEditedAvailability })
    )
  }

  return (
    <React.Fragment>
      <TableRow sx={{ borderBottom: 'none' }}>
        <TableCell component="th" id={day} scope="row" align={'left'}>
          <Typography>{capitalizeFirstLetter(day)}</Typography>
        </TableCell>

        <TableCell component="th" scope="row" align={'left'}>
          <Table>
            <TableBody>
              {userAvailability &&
              userAvailability[day as keyof typeof userAvailability]
                ? userAvailability[day as keyof typeof userAvailability].map(
                    ({ startTime, endTime }, index) => {
                      return (
                        <AvailabilityForm
                          key={day + '-' + index}
                          startTime={startTime}
                          endTime={endTime}
                          id={day + '-' + index}
                          isEditing={isEditing}
                          // onTimeChange={handleTimeChange}
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
  // onTimeChange: (id: string, startTime: string, endTime: string) => void
}

type TimeOptions = {
  [key: string]: string
}

/**
 * @description
 * @param param0
 * @returns
 */
const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  startTime,
  endTime,
  id,
  isEditing,
  // onTimeChange,
}) => {
  const timeOptions: TimeOptions = generateTimeOptions()
  const timeOptionsIndex: string[] = generateTimeOptionsIndex()
  const [editedStartTime, setEditedStartTime] = useState(startTime)
  const [editedEndTime, setEditedEndTime] = useState(endTime)
  const userAvailability = useSelector(
    selectMemberAvailability
  ) as User['availabilities']
  const dispatch = useDispatch()

  const isInvalidRange = parseInt(startTime) >= parseInt(endTime)
  const isOverLap = isTimeOverlap(
    startTime,
    endTime,
    parseInt(id.split('-')[1]),
    userAvailability[id.split('-')[0] as keyof typeof userAvailability]
  )

  useEffect(() => {
    if (isInvalidRange || isOverLap) {
      dispatch(setIsAvailabilityError(true))
    }
    dispatch(setIsInvalid({ [id]: isInvalidRange }))
    dispatch(setIsOverlap({ [id]: isOverLap }))
  }, [isInvalidRange, isOverLap, dispatch, id])

  /**
   * @description: This function updates the memberAvailability in the redux state but
   *               not in the backend
   *
   * @param id -> Contains day and index of array item to edit e.g. (id = 'monday-3). This tells me
   *               I need to edit day array with index 3. if index >= dayArray.length a new item is added
   *
   * @param startTime -> The selected startTime for the time block
   *
   * @param endTime -> The selected endTime for the time block
   */
  const handleTimeChange = (startTime: string, endTime: string) => {
    // console.log(id, startTime, endTime)
    // Extract day and index from id
    const weekDay = id.split('-')[0]
    const index = parseInt(id.split('-')[1], 10)
    // console.log('weekDay: ' ,weekDay, index)

    // Create a copy of the userAvailability[day] array, so it can be mutated
    const newEditedAvailability = [
      ...userAvailability[weekDay as keyof typeof userAvailability],
    ] as Array<{
      startTime: string
      endTime: string
    }> // create a new copy of the array

    // Choose to edit or add a new time block
    if (newEditedAvailability.length > index) {
      newEditedAvailability[index] = { startTime, endTime }
    } else {
      newEditedAvailability.push({ startTime, endTime })
    }

    // dispatch(setResetStateError({}))
    // Update time block for memberAvailability in redux state
    dispatch(
      setMemberAvailabilityDay({
        day: weekDay,
        availabilityDay: newEditedAvailability,
      })
    )
  }

  const handleDeleteTimeBlock = () => {
    const weekDay = id.split('-')[0]
    const index = parseInt(id.split('-')[1], 10)

    const dayAvailability = [
      ...userAvailability[weekDay as keyof typeof userAvailability],
    ]
    dayAvailability.splice(index, 1)
    // dispatch(setResetStateError({}))
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
                  handleTimeChange(event.target.value, editedEndTime)
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
                  handleTimeChange(editedStartTime, event.target.value)
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
        {isOverLap ? (
          <Typography color="error" variant="caption">
            {`The time block overlaps. `}
          </Typography>
        ) : null}

        {isInvalidRange ? (
          <Typography color="error" variant="caption">
            {`Invalid time range.`}
          </Typography>
        ) : null}
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
