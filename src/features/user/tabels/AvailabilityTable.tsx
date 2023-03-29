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

export default function AvailabilityTable() {
    const authUser = useSelector(selectCurrentUser)
    const [availabilities, setAvailabilities] = useState<User['availabilities']>()

    useEffect(() => {
        if (authUser && authUser.availabilities) {
            console.log('User Availabilities: ' + authUser.availabilities)
            setAvailabilities(authUser.availabilities)
        }
    }, [authUser])
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table
                        stickyHeader
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={'medium'}
                    >
                        <TableBody>
                            {availibilities
                                ? Object.keys(availabilities).map((day) => {
                                      console.log('key: ' + day)
                                      return (
                                          <AvailabilityItem
                                              key={uuid()}
                                              dayAvailability={
                                                  availabilities ? availabilities[day] : {}
                                              }
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
