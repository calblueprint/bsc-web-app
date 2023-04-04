import * as React from 'react'

//** Materials UI Components */
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'

//** Custom packages */
import uuid from 'react-uuid'

//** Hooks */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AvailabilityItem from '../items/AvailabilityItem'

//** Redux state imports */
import { selectMemberAvailability, setMemberAvailability } from '../../userAvailability/userAvailabilitySlice'
import { selectCurrentUser } from '@/features/auth/authSlice'

//** Redux Api imports */
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'
import {
  useUpdateUserAvailabilityMutation,
} from '../../userAvailability/userAvailabilityApiSlice'

//** Typescript types */
import { User } from '@/types/schema'

//** Import constants */
import { DAYS } from '@/utils/constants'


/**
 * @description Displays and edits the current logged in user
 * 
 */
export default function AvailabilityTable() {
  //** Get Logged In user from redux */
  const authUser = useSelector(selectCurrentUser) as User
  //** Get Logged In user availability */
  const userAvailability = useSelector(selectMemberAvailability) as User['availabilities']

  //**  Hooks */
  const dispatch = useDispatch()

  //** Function from Redux to update user abailability in the backEnd */
  const [
    updateUserAvailability,
    { isLoading: updateUserIsLoading, isSuccess: updateUserIsSuccess },
  ] = useUpdateUserAvailabilityMutation()

  //** Function from Redux to update the current user from the backend */
  const [establishContext, { isLoading, isSuccess }] =
    useEstablishContextMutation()

  //** True when user is editing availability */
  const [isEditing, setIsEditing] = useState(false)

  //** It sets editing to false and restores the availability to the current logged in user */
  const handleCancel = () => {
    setIsEditing(false)
    dispatch(setMemberAvailability(authUser.availabilities))
  }

  //** It saves the changes made to the memberAvailability redux state to the backEnd */
  const handleSave = async () => {

    // Verify that the authUser is logged in
    if (!authUser) {
      console.log('[ERROR]: authUser is not defined')
      return false
    }

    // Verify that the memberAvailability from redux is define
    if (!userAvailability) {
      console.log('[ERROR]: userAvailabilities is not defined')
      return false
    }

    try {
      // make sure userId is defined
      if (authUser.id) {
        // Update user availability with the availability in the memberAvailability redux state
        const payload = await updateUserAvailability({
          id: authUser.id,
        }).unwrap()

        console.log('Success!! Payload: ', payload)
        // This is to update the logged in user with the data in the backend (since we just changed it)
        establishContext(authUser.id as string)
        // Set editing to false to exit editing state and go to display state
        setIsEditing(false)
      } else {
        console.error('[ERROR]: authUser.id is not defined')
      }
    } catch (error) {
      console.log('[ERROR]: ', error)
    }
  }

  //** Watch authUser for changes */
  useEffect(() => {
    // Make sure authUser and authUser's availability are defined
    if (authUser && authUser.availabilities) {
    
      // make a copy of the current user availabilities in order to mute it
      const availabilitiesCopy = { ...authUser.availabilities }

      // Sort each day's availability by startTime
      Object.keys(availabilitiesCopy).map((dayKey) => {
        // Make a copy of the day array and sort it
        availabilitiesCopy[dayKey] = [...availabilitiesCopy[dayKey]].sort(
          (
            a: { startTime: string; endTime: string },
            b: { startTime: string; endTime: string }
          ) => parseInt(a.startTime) - parseInt(b.startTime)
        )
      })

      // Update the memberAvailability state from redux
      dispatch(setMemberAvailability(availabilitiesCopy))
    }
  }, [authUser, dispatch])

  useEffect (()=> {
    console.log('authUserChecking')
    if (!authUser.availabilities) {
      handleSave()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authUser])

  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 840 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography flexGrow={1}>Weekly Schedule</Typography>
                </TableCell>

                <TableCell>
                  <Box flexGrow={2} />
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Box display={'flex'}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ marginLeft: 2 }}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Box display={'flex'}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Availability
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userAvailability
                ? DAYS.map((day) => {
                    return (
                      <AvailabilityItem
                        key={uuid()}
                        day={day}
                        isEditing={isEditing}
                        
                      />
                    )
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
