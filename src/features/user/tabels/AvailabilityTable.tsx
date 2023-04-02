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
import { useSelector } from 'react-redux'
import { selectShiftById } from '@/features/shift/shiftApiSlice'
import AvailabilityItem from '../items/AvailabilityItem'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useEffect, useState } from 'react'
import { User } from '@/types/schema'
import { useUpdateUserMutation } from '../userApiSlice'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function AvailabilityTable() {
    const authUser = useSelector(selectCurrentUser)
    const [updateUser, { isLoading: updateUserIsLoading, isSuccess: updateUserIsSuccess }] =
        useUpdateUserMutation()
    const [establishContext, { isLoading, isSuccess }] = useEstablishContextMutation()
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

        const data = { data: {}, userId: authUser.id }
        data.data = { availabilities }
        try {
            const payload = await updateUser(data).unwrap()
            console.log('Success!! Payload: ', payload)
            establishContext(authUser.id as string)
        } catch (error) {
            console.log('[ERROR]: ', error)
        }
    }

    useEffect(() => {
        if (authUser && authUser.availabilities && !isEditing) {
            console.log('User Availabilities: ' + authUser.availabilities)
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
                        aria-labelledby='tableTitle'
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
                                                variant='outlined'
                                                onClick={handleCancel}
                                            >
                                                Cancle
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant='contained'
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
                                                variant='contained'
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
                                              dayAvailability={
                                                  availabilities &&
                                                  availabilities[day as keyof typeof availabilities]
                                                      ? availabilities[
                                                            day as keyof typeof availabilities
                                                        ]
                                                      : []
                                              }
                                              day={day}
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
