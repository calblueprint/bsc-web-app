import FilterAutoCompleteBar from '@/components/shared/searchBar/FilterAutoCompleteBar'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { selectWeeklyScheduleShiftsByWeekNumber } from '@/features/scheduledShift/scheduledShiftSlice'
import AllScheduledShiftsTable from '@/features/scheduledShift/tables/AllScheduledShiftsTable'
import { useGetHouseUsersQuery } from '@/features/user/userApiSlice'
import { House } from '@/types/schema'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import { Typography } from '@mui/material'

const ManagerIndividualTabContent = () => {
  const authHouse = useSelector(selectCurrentHouse) as House
  const weekScheduleIds = useSelector(selectWeeklyScheduleShiftsByWeekNumber)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [userScheduleIds, setUserScheduleIds] = useState<string[]>([])
  const { data: users } = useGetHouseUsersQuery(authHouse.id)
  const { data: scheduledShifts } = useGetScheduledShiftsQuery(authHouse.id)

  const handleSelectedUserId = (userId: string) => {
    console.log(userId)
    setSelectedUserId(userId)
  }

  useEffect(() => {
    if (weekScheduleIds && scheduledShifts) {
      if (!selectedUserId) {
        setUserScheduleIds([])
      } else {
        const filteredSchedule = weekScheduleIds.filter(
          (shiftId) =>
            scheduledShifts.entities[shiftId]?.assignedUser === selectedUserId
        )
        setUserScheduleIds(filteredSchedule)
      }
    }
  }, [weekScheduleIds, selectedUserId, scheduledShifts])

  return (
    <React.Fragment>
      <Stack direction={'row'}>
        <Box sx={{ flexGrow: 3 }} marginBottom={2}>
          <FilterAutoCompleteBar
            state={users}
            handleSelectedUserId={handleSelectedUserId}
          />
        </Box>
      </Stack>
      {scheduledShifts && userScheduleIds && selectedUserId ? (
        <AllScheduledShiftsTable
          scheduledShiftIDs={userScheduleIds}
          scheduledShiftDictionary={scheduledShifts.entities}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <PersonSearchIcon fontSize="large" />

          <Typography>Search for a member’s shift schedule</Typography>
        </Box>
      )}
    </React.Fragment>
  )
}
export default ManagerIndividualTabContent
