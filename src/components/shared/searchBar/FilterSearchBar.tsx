import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { search } from '@/assets/StyleGuide'

interface FilterSearchBarProps {
  onSearchChange: (value: string) => void
  onSearchSubmit?: (event: FormEvent) => void
}

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  onSearchChange,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    onSearchChange(event.target.value)
  }

  return (
    <Box
      component="form"
      sx={search}
      onSubmit={onSearchSubmit}
    >
      <InputBase
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        sx={{
          flexGrow: 1,
          color: 'inherit',
          ml: 1,
        }}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  )
}

export default FilterSearchBar
