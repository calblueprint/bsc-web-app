import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
} from '@mui/material'
import { useEffect, useState } from 'react'
//** Materials UI components */
import useMediaQuery from '@mui/material/useMediaQuery'
//** Materials UI styles */
import { useTheme } from '@mui/material/styles'
import { selectDrawerWidth } from '@/features/user/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import CellShiftsItme from '../items/emptyRowItems/CellShiftsItme'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import RowUserScheduleItem from '../items/userRowItems/RowUserScheduleItem'
import { setUserSchedule, setUsersSchedule } from '../scheduleSlice'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import {
  capitalizeFirstLetter,
  getNumberOfBlocks,
  generateContinuousMilitaryTimeForWeek,
  findAvailableShiftsForUsers,
  stableSort,
  getComparator,
  Order,
  sortUserIdsByProperty,
} from '@/utils/utils'
import RowEmptyShiftsItem from '../items/emptyRowItems/RowEmptyShiftsItem'
import { DAYS } from '@/utils/constants'
import { User } from '@/types/schema'

const ScheduleTable = () => {
  /** Materials UI styles */
  //   const theme = useTheme()
  //   const [drawerWidth, setDrawerWidth] = useState(280)
  const drawerWidth = useSelector(selectDrawerWidth)
  // const { data: shifts } = useGetShiftsQuery('EUC')
  const { data: users } = useGetUsersQuery({})
  const [sortedUsers, setSortedUsers] = useState<string[]>()

  const dispatch = useDispatch()
  // TODO: Add description
  //   const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  //   useEffect(() => {
  //     console.log('isSmUp: ' + isSmUp)
  //     if (isSmUp) {
  //         setDrawerWidth(280)
  //     }
  //   }, [isSmUp])

  // useEffect(() => {
  //   if (users && shifts) {
  //     console.log()
  //     const usersSchedule = findAvailableShiftsForUsers(users, shifts)

  //     dispatch(setUsersSchedule({ usersSchedule }))
  //   }
  // }, [users, shifts])

  useEffect(() => {
    if (users) {
      const sortedList = sortUserIdsByProperty(users, 'hoursAssigned')
      setSortedUsers(sortedList as string[])
    }
  }, [users])

  return (
    <Box
      sx={{
        maxWidth: `calc(100vw - ${drawerWidth}px)`,
        maxHeight: `calc(100vh - ${300}px)`,
      }}
    >
      <Paper
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`,
          height: `calc(100vh - ${300}px)`,
          mb: 2,
        }}
      >
        <TableContainer
          style={{
            overflowX: 'auto',
            width: `calc(100vw - ${drawerWidth}px)`,
            height: `calc(100vh - ${300}px)`,
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
                    minWidth: 200,
                    position: 'sticky',
                    borderRight: '1px solid black',
                    zIndex: 5,
                    left: 0,
                    fontWeight: 'bold',
                  }}
                >
                  Weekly Schedule
                </TableCell>
                {DAYS
                  ? DAYS.map((day) => (
                      <TableCell
                        key={day}
                        align="center"
                        style={{
                          minWidth: 200,
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
              <RowEmptyShiftsItem />

              {sortedUsers
                ? sortedUsers.map((userId) => (
                    <RowUserScheduleItem key={userId} userId={userId} />
                  ))
                : null}

              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default ScheduleTable
