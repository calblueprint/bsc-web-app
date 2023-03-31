import React, { useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import { capitalizeFirstLetter } from '../../../utils/utils'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import dayjs from 'dayjs'

type AvailabilitiesProps = {
    dayAvailability: { startTime: string; endTime: string }[]
    day: string
}

const generateTimeOptions = () => {
    const options = []
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            options.push(dayjs().hour(i).minute(j).format('hh:mm A'))
        }
    }
    return options
}

const AvailabilityItem: React.FC<AvailabilitiesProps> = ({ dayAvailability, day }) => {
    const [startWindowTime, setStartWindowTime] = useState(
        dayjs().startOf('hour').format('hh:mm:a')
    )
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    function handleSelectChange(event: SelectChangeEvent<string>, child: React.ReactNode) {
        const newValue = event.target.value
        setStartWindowTime(event.target.value as string)
    }
    const handleClick = () => {}

    const timeOptions = generateTimeOptions()

    return (
        <TableRow>
            <TableCell component='th' id={day} scope='row' align={'left'}>
                {capitalizeFirstLetter(day)}
            </TableCell>
            <TableCell>
                <FormControl fullWidth>
                    <InputLabel id='start-window-time-label'>Start Window Time</InputLabel>
                    <Select
                        labelId='start-window-time-label'
                        id='start-window-time-select'
                        value={startWindowTime}
                        onChange={handleSelectChange}
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                        label='Start Window Time'
                        MenuProps={{
                            anchorEl: anchorEl, // set the element to anchor the menu to
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
                        {anchorEl &&
                            timeOptions.map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    )
}

export default AvailabilityItem
