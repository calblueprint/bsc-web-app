import React, { useState } from 'react'
import {
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material'
type Days =
  | 'All'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

interface FilterSelectProps {
  filterOptions: Days[]
  onFilterChange: (selectedFilter: Days) => void
}

const FilterShiftByDayBtn: React.FC<FilterSelectProps> = ({
  filterOptions,
  onFilterChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<Days>(filterOptions[0])

  const handleChange = (event: SelectChangeEvent<Days>) => {
    const filterValue = event.target.value as Days
    setSelectedFilter(filterValue)
    onFilterChange(filterValue)
  }

  return (
    <FormControl fullWidth>
      <Select
        value={selectedFilter}
        onChange={handleChange}
        size="small"
        inputProps={{
          name: 'filter',
          id: 'filter-select',
        }}
        sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
      >
        {filterOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FilterShiftByDayBtn
