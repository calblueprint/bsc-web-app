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
import { EntityId } from '@reduxjs/toolkit'
import {
  capitalizeFirstLetter,
  getNumberOfBlocks,
  generateContinuousMilitaryTimeForWeek,
  findAvailableShiftsForUsers,
} from '@/utils/utils'

const ScheduleTable = () => {
  /** Materials UI styles */
  //   const theme = useTheme()
  //   const [drawerWidth, setDrawerWidth] = useState(280)
  const drawerWidth = useSelector(selectDrawerWidth)
  const { data: shifts } = useGetShiftsQuery('EUC')
  const { data: users } = useGetUsersQuery({})

  const dispatch = useDispatch()
  // TODO: Add description
  //   const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  //   useEffect(() => {
  //     console.log('isSmUp: ' + isSmUp)
  //     if (isSmUp) {
  //         setDrawerWidth(280)
  //     }
  //   }, [isSmUp])

  const stickyStyle = {
    background: 'white',
    position: 'sticky',
    zIndex: 10,
  }

  useEffect(() => {
    if (users && shifts) {
      console.log()
      const usersSchedule = findAvailableShiftsForUsers(users, shifts)
      // users.ids.map((userId) => {
      //   let weeklySchedule = {}
      //   const availability = users.entities[userId]?.availabilities
      //   if (availability) {
      //     const days = Object.keys(availability)
      //     if (days && days.length) {
      //       days.forEach((day) => {
      //         const dayArray = shifts.ids.filter(
      //           (id) =>
      //             shifts.entities[id]?.possibleDays.includes(
      //               day.toLowerCase()
      //             ) ||
      //             shifts.entities[id]?.possibleDays.includes(
      //               capitalizeFirstLetter(day)
      //             )
      //         )
      //         if (dayArray.length) {
      //           weeklySchedule = {
      //             ...weeklySchedule,
      //             [day.toLowerCase()]: dayArray,
      //           }
      //         }
      //       })
      //     }
      //   }
      //   usersSchedule = { ...usersSchedule, [userId]: weeklySchedule }
      // })
      // console.log({ usersSchedule: usersSchedule })
      dispatch(setUsersSchedule({ usersSchedule }))
    }
  }, [users, shifts])

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
                    minWidth: 250,
                    position: 'sticky',
                    borderRight: '1px solid black',
                    zIndex: 5,
                    left: 0,
                  }}
                >
                  Weekly Schedule
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Monday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Tuesday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Wednesday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Thursday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Friday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Saturday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderLeft: '1px solid black' }}
                >
                  Sunday
                </TableCell>
                {/* Add more headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ ...stickyStyle, top: 57 }}>
                <TableCell
                  style={{
                    minWidth: 250,
                    height: 100,
                    borderRight: '1px solid black',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1, // add z-index to ensure it appears above other columns
                  }}
                >
                  Empty Shifts
                </TableCell>
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}

                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {shifts ? (
                  <CellShiftsItme shiftIds={shifts.ids as string[]} />
                ) : null}
                {/* Add more cells as needed */}
              </TableRow>

              {users
                ? users.ids.map((userId) => (
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
