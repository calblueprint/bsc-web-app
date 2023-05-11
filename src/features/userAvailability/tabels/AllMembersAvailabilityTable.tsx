import TableContainer from '@mui/material/TableContainer'
import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { useSelector } from 'react-redux'
import { selectDrawerWidth } from '@/features/user/usersSlice'
import TableCell from '@mui/material/TableCell'
import { DAYS } from '@/utils/constants'
import { Paper } from '@mui/material'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import { sortUserIdsByProperty } from '@/utils/utils'
import RowUserScheduleItem from '@/features/tentativeSchedule/items/userRowItems/RowUserScheduleItem'
import RowMemeberAvailabilityItem from '../items/RowMemeberAvailabilityItem'

const AllMembersAvailabilityTable = () => {
  const drawerWidth = useSelector(selectDrawerWidth)
  const { data: users } = useGetUsersQuery({})
  const [sortedUsers, setSortedUsers] = useState<string[]>()
  const maxWH = {
    maxWidth: `calc(100vw - ${drawerWidth}px)`,
    maxHeight: `calc(100vh - ${300}px)`,
  }

  useEffect(() => {
    if (users) {
      const sortedList = sortUserIdsByProperty(users, 'lastName')
      setSortedUsers(sortedList as string[])
    }
  }, [users])

  return (
    <Box sx={maxWH}>
      <TableContainer
        component={Paper}
        style={{
          overflowX: 'auto',
          ...maxWH,
        }}
      >
        <Table
          stickyHeader
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'medium'}
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{
                  minWidth: 180,
                  position: 'sticky',
                  borderRight: '1px solid black',
                  zIndex: 5,
                  left: 0,
                  fontWeight: 'bold',
                }}
              >
                Weekly Availability
              </TableCell>
              {DAYS
                ? DAYS.map((day) => (
                    <TableCell
                      key={day}
                      align="center"
                      style={{
                        minWidth: 150,
                        borderLeft: '1px solid black',
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      {day}
                    </TableCell>
                  ))
                : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers
              ? sortedUsers.map((userId) => (
                  <RowMemeberAvailabilityItem key={userId} userId={userId} />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AllMembersAvailabilityTable
