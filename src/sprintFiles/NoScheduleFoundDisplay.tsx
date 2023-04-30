import React from 'react'
import { Grid } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Used to indicate that no schedule was found for this user (referenced in ManagerIndividualTabContent)
 */
const NoScheduleFoundDisplay = () => {
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
          <ErrorOutlineIcon />
        </Grid>
        <Grid item xs={3}>
            No schedule found for this member
        </Grid>   
    </Grid> 
  )
}

export default NoScheduleFoundDisplay