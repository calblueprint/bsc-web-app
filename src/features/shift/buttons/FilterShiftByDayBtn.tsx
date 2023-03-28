// FilterSelect.tsx
import React, { useState } from 'react'
import { MenuItem, FormControl, Select, InputLabel, SelectChangeEvent } from '@mui/material'
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

const FilterShiftByDayBtn: React.FC<FilterSelectProps> = ({ filterOptions, onFilterChange }) => {
    const [selectedFilter, setSelectedFilter] = useState<Days>(filterOptions[0])

    const handleChange = (event: SelectChangeEvent<Days>) => {
        const filterValue = event.target.value as Days
        setSelectedFilter(filterValue)
        onFilterChange(filterValue)
    }

    return (
        <FormControl fullWidth variant='outlined'>
            <InputLabel htmlFor='filter-select'>Filter</InputLabel>
            <Select
                label='Filter'
                value={selectedFilter}
                onChange={handleChange}
                inputProps={{
                    name: 'filter',
                    id: 'filter-select',
                }}
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
