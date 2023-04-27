import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import React from 'react'

//** Custom Functions */
import {
  generateTimeOptions,
  generateTimeOptionsIndex,
} from '../../../utils/utils'

type TimeOptions = {
  [key: string]: string
}

type TimeSelectFieldProps = {
  fieldId: string
  labelId: string
  label: string
  value: unknown
  handleOnChange: (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => void | undefined
}

const TimeSelectField = (props: TimeSelectFieldProps) => {
  const { handleOnChange, fieldId, labelId, value, label } = props
  const timeOptions: TimeOptions = generateTimeOptions()
  const timeOptionsIndex: string[] = generateTimeOptionsIndex()

  return (
    <React.Fragment>
      <Box>
        <FormControl>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            labelId={labelId}
            id={fieldId}
            value={value}
            onChange={handleOnChange}
            label={label}
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
    </React.Fragment>
  )
}

export default TimeSelectField
