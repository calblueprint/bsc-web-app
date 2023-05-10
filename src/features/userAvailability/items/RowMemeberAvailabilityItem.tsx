import CellScheduleShift from '@/features/tentativeSchedule/items/userRowItems/CellScheduleShift'
import { selectUserById } from '@/features/user/userApiSlice'
import { RootState } from '@/store/store'
import { DAYS } from '@/utils/constants'
import { Box, Paper, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { EntityId } from '@reduxjs/toolkit'
import React from 'react'
import { useSelector } from 'react-redux'
import AvailabilityItem from './AvailabilityItem'
import uuid from 'react-uuid'
import { generateTimeOptions } from '@/utils/utils'
type RowMemberAvailabilityItemProps = {
  userId: EntityId
}
type TimeOptions = {
  [key: string]: string
}
const RowMemeberAvailabilityItem = (props: RowMemberAvailabilityItemProps) => {
  const { userId } = props
  const timeOptions: TimeOptions = generateTimeOptions()
  const user = useSelector((state: RootState) => selectUserById(state, userId))
  return user ? (
    <TableRow>
      <TableCell
        align="center"
        style={{
          minWidth: 200,
          position: 'sticky',
          borderRight: '1px solid black',
          backgroundColor: 'white',
          zIndex: 4,
          left: 0,
        }}
      >
        <Box>
          <Typography fontWeight="bold"> {user.displayName}</Typography>
        </Box>
        <Box>
          {`Hours Needed: ${
            5 - (user.hoursAssigned ? user.hoursAssigned : 0)
          } hrs`}
        </Box>
      </TableCell>
      {DAYS
        ? DAYS.map((day) => {
            const lowercaseDay = day.toLowerCase()
            let dayAvailability: Array<{ startTime: string; endTime: string }> =
              []
            if (user.availabilities.hasOwnProperty(lowercaseDay)) {
              dayAvailability = user.availabilities[lowercaseDay]
            }
            return (
              <TableCell
                key={day}
                align="center"
                style={{
                  minWidth: 200,
                  borderLeft: '1px solid black',
                }}
              >
                <React.Fragment>
                  {dayAvailability.map((interval) => {
                    return (
                      <Box key={uuid()} component={Paper} marginBottom={1}>
                        {`${timeOptions[interval.startTime]} - ${
                          timeOptions[interval.endTime]
                        }`}
                      </Box>
                    )
                  })}
                </React.Fragment>
              </TableCell>
            )
          })
        : null}
    </TableRow>
  ) : null
}

export default RowMemeberAvailabilityItem
