import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { getComparator, stableSort, Order } from '../../../utils/utils'
import { HeadCell } from '../../../interfaces/interfaces'
import uuid from 'react-uuid'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
import AvailabilityItem from '../items/AvailabilityItem'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useEffect, useState } from 'react'
import { User } from '@/types/schema'
import {
  useUpdateUserAvailabilityMutation,
  useUpdateUserMutation,
} from '../userApiSlice'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'
import { selectMemberAvailability, setMemberAvailability } from '../usersSlice'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export default function AvailabilityTable() {
  const authUser = useSelector(selectCurrentUser) as User
  const dispatch = useDispatch()
  const userAvailability = useSelector(selectMemberAvailability)
  const [
    updateUserAvailability,
    { isLoading: updateUserIsLoading, isSuccess: updateUserIsSuccess },
  ] = useUpdateUserAvailabilityMutation()

  const [establishContext, { isLoading, isSuccess }] =
    useEstablishContextMutation()
  const [availabilities, setAvailabilities] = useState<User['availabilities']>()
  const [isEditing, setIsEditing] = useState(false)

  const onAvailabilityChange = (
    availability: { startTime: string; endTime: string }[],
    day: string
  ) => {
    console.log(' day: ' + day)
    // availability.forEach((a) => console.log('onAvailabilityChange: ', a))
    const newAvailabilities = { ...availabilities, [day]: availability }
    // console.log({ ...availabilities, [day]: availability })

    setAvailabilities(newAvailabilities)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!authUser) {
      console.log('[ERROR]: authUser is not defined')
      return false
    }
    if (!availabilities) {
      console.log('[ERROR]: availabilities is not defined')
      return false
    }
    if (!userAvailability) {
      console.log('[ERROR]: userAvailabilities is not defined')
      return false
    }

    const data = { data: {}, userId: authUser.id }
    data.data = { availabilities }
    try {
      if (authUser.id) {
        const payload = await updateUserAvailability({
          id: authUser.id,
        }).unwrap()
        console.log('Success!! Payload: ', payload)
        establishContext(authUser.id as string)
        setIsEditing(false)
      } else {
        console.error('[ERROR]: authUser.id is not defined')
      }
    } catch (error) {
      console.log('[ERROR]: ', error)
    }
  }

  useEffect(() => {
    if (authUser && authUser.availabilities) {
      let availabilities = { ...authUser.availabilities }

      Object.keys(availabilities).map((dayKey) => {
        availabilities[dayKey] = [...availabilities[dayKey]].sort(
          (
            a: { startTime: string; endTime: string },
            b: { startTime: string; endTime: string }
          ) => parseInt(a.startTime) - parseInt(b.startTime)
        )
      })
      dispatch(setMemberAvailability(availabilities))
    }
  }, [authUser, isEditing])

  useEffect(() => {
    if (authUser && authUser.availabilities && !isEditing) {
      console.log('User Availabilities: ' + authUser.availabilities)
      // const stableAvailabilities = authUser.availabilities.map(day => )
      setAvailabilities(authUser.availabilities)
    }
  }, [authUser, isEditing])
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
              {availabilities
                ? days.map((day) => {
                    console.log('key: ' + day)
                    return (
                      <AvailabilityItem
                        key={uuid()}
                        //   dayAvailability={
                        //       availabilities &&
                        //       availabilities[day as keyof typeof availabilities]
                        //           ? availabilities[
                        //                 day as keyof typeof availabilities
                        //             ]
                        //           : []
                        //   }
                        day={day}
                        isEditing={isEditing}
                        onAvailabilityChange={onAvailabilityChange}
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
