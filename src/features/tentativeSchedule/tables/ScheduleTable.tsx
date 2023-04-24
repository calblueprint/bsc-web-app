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
import { useSelector } from 'react-redux'

const ScheduleTable = () => {
  /** Materials UI styles */
  //   const theme = useTheme()
  //   const [drawerWidth, setDrawerWidth] = useState(280)
  const drawerWidth = useSelector(selectDrawerWidth)
  // TODO: Add description
  //   const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  //   useEffect(() => {
  //     console.log('isSmUp: ' + isSmUp)
  //     if (isSmUp) {
  //         setDrawerWidth(280)
  //     }
  //   }, [isSmUp])

  return (
    <Box sx={{ maxWidth: `calc(100vw - ${drawerWidth}px)` }}>
      <Paper sx={{ width: `calc(100vw - ${drawerWidth}px)`, mb: 2 }}>
        <TableContainer
          style={{ overflowX: 'auto', width: `calc(100vw - ${drawerWidth}px)` }}
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
                    borderRight: '1px solid black',
                    position: 'sticky',
                    zIndex: 3,
                    left: 0,
                  }}
                >
                  Weekly Schedule
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Monday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Tuesday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Wednesday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Thursday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Friday
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Saturday
                </TableCell>
                <TableCell align="center" style={{ minWidth: 200 }}>
                  Sunday
                </TableCell>
                {/* Add more headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
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
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Monday
                </TableCell>
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Tuesday
                </TableCell>
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Wednesday
                </TableCell>
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Thursday
                </TableCell>
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Friday
                </TableCell>
                <TableCell
                  style={{ minWidth: 200, borderRight: '1px solid black' }}
                >
                  Saturday
                </TableCell>
                <TableCell style={{ minWidth: 200 }}>Sunday</TableCell>
                {/* Add more cells as needed */}
              </TableRow>

              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default ScheduleTable
