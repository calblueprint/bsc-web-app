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

type AvailabilitiesProps = {
    dayAvailability: { startTime: string; endTime: string }[]
    day: string
    onAvailabilityChange: (
        availability: { startTime: string; endTime: string }[],
        day: string
    ) => void
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
    dayAvailability,
    day,
    onAvailabilityChange,
}) => {
    const [editedAvailability, setEditedAvailability] = useState<
        { startTime: string; endTime: string }[]
    >([])
    function handleSelectChange(event: SelectChangeEvent<string>, child: React.ReactNode) {
        const newValue = event.target.value
    }
    const handleTimeChange = (id: string, startTime: string, endTime: string) => {
        console.log(id, startTime, endTime)
        const weekDay = id.split('-')[0]
        const index = parseInt(id.split('-')[1], 10)

        const newEditedAvailability = [...editedAvailability] // create a new copy of the array

        if (newEditedAvailability.length > index) {
            newEditedAvailability[index] = { startTime, endTime }
        } else {
            newEditedAvailability.push({ startTime, endTime })
        }

        setEditedAvailability(newEditedAvailability) // update the state with the new copy of the array
        onAvailabilityChange(newEditedAvailability, day)
    }

    useEffect(() => {
        if (dayAvailability) {
            setEditedAvailability(dayAvailability)
        }
    }, [dayAvailability])

    // useEffect(() => {
    //     if (editedAvailability) {
    //         onAvailabilityChange(editedAvailability, day)
    //     }
    // }, [editedAvailability])

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: 'none' }}>
                <TableCell component='th' id={day} scope='row' align={'left'}>
                    <Typography>{capitalizeFirstLetter(day)}</Typography>
                </TableCell>

                <TableCell component='th' scope='row' align={'left'}>
                    <Table>
                        <TableBody>
                            {dayAvailability.map(({ startTime, endTime }, index) => {
                                return (
                                    <AvailabilityForm
                                        key={day + '-' + index}
                                        startTime={startTime}
                                        endTime={endTime}
                                        id={day + '-' + index}
                                        onTimeChange={handleTimeChange}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableCell>
                <TableCell>
                    <IconButton>
                        <AddIcon />
                    </IconButton>
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
    onTimeChange: (id: string, startTime: string, endTime: string) => void
}

type TimeOptions = {
    [key: string]: string
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
    startTime,
    endTime,
    id,
    onTimeChange,
}) => {
    const timeOptions: TimeOptions = generateTimeOptions()
    const timeOptionsIndex: string[] = generateTimeOptionsIndex()
    const [editedStartTime, setEditedStartTime] = useState(startTime)
    const [editedEndTime, setEditedEndTime] = useState(endTime)

    const form = (
        <TableRow key={id} sx={{ borderBottom: 'none' }}>
            <TableCell component='th' scope='row' align={'left'} sx={{ borderBottom: 'none' }}>
                <Box display={'flex'} flexDirection={'row'}>
                    <Box>
                        <FormControl>
                            <InputLabel id='start-time-label'>From</InputLabel>
                            <Select
                                labelId='start-time-label'
                                id='start-time-select'
                                value={editedStartTime}
                                onChange={(event) => {
                                    setEditedStartTime(event.target.value)
                                    onTimeChange(id, event.target.value, editedEndTime)
                                }}
                                label='Start Time'
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
                            <InputLabel id='end-time-label'>To</InputLabel>
                            <Select
                                labelId='end-time-label'
                                id='end-time-select'
                                value={editedEndTime}
                                onChange={(event) => {
                                    setEditedEndTime(event.target.value)
                                    onTimeChange(id, editedStartTime, event.target.value)
                                }}
                                label='End Time'
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
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    )

    return <React.Fragment>{form}</React.Fragment>
}
