import { Grid } from '@mui/material'
import React from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

/**
 * Used to indicate that the manager should search for a member (referenced in ManagerIndividualTabContent)
 */
const SearchForMemberDisplay = () => {
  return (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
        >
        <Grid item xs={1}>
          <PersonSearchIcon />
        </Grid>
        <Grid item xs={3}>
            Search for a member&apos;s shift schedule
        </Grid>   
    </Grid> 
  )
}

export default SearchForMemberDisplay