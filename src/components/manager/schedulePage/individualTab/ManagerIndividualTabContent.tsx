import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { Days, House, ScheduledShift, Shift } from '@/types/schema'
import React, { useState, FormEvent, useEffect, SyntheticEvent } from 'react'
import { useSelector } from 'react-redux'
import IndividualScheduledShifts from '@/sprintFiles/IndividualScheduledShifts'
import { Autocomplete, Box, Grid, Stack, TextField } from '@mui/material'
import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterShiftByDayBtn from '@/features/shift/buttons/FilterShiftByDayBtn'
import NewShiftBtn from '@/features/shift/buttons/NewShiftBtn'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import SearchForMemberDisplay from '@/sprintFiles/SearchForMemberDisplay'
import NoScheduleFoundDisplay from '@/sprintFiles/NoScheduleFoundDisplay'


const ManagerIndividualTabContent = () => {
  const currentHouse: House = useSelector(selectCurrentHouse) as House
  const [filteredUserIDs, setFilteredUserIDs] = useState<EntityId[]>();;
  const [selectedUserID, setSelectedUserID] = useState<EntityId>('');
  const [tableScheduledShiftIDs, setTableScheduledShiftIDs] = useState<EntityId[] | undefined>();

  const {
      data: scheduledShifts
  } = useGetScheduledShiftsQuery(currentHouse.houseID)

  const {
    data: usersInHouse
  } = useGetUsersQuery(currentHouse.houseID)

  const extractName = (option: EntityId) => {
    if (usersInHouse === undefined) {
      return ''
    }
    const userObject = usersInHouse.entities[option];
    if (userObject === undefined) {
      return ''
    }
    return userObject.displayName;
  }
  
  const updateSelectedUserAndShiftIDs = (event: SyntheticEvent<Element, Event>, value: EntityId | null) => {
    if (value === null) {
      setSelectedUserID('');
      setTableScheduledShiftIDs(undefined);
      console.log('Cleared');
      return;
    } else if (value === selectedUserID) {
      return;
    } else {
      setSelectedUserID(value);
      setTableScheduledShiftIDs(undefined);
    }
    if (usersInHouse === undefined) {
      console.log('Something went wrong.');
      return;
    }
    const userObject = usersInHouse.entities[value];
    if (userObject === undefined) {
      console.log('Something went wrong.');
      return;
    }
    const assignedShifts: EntityId[] = userObject.assignedScheduledShifts;

    // TODO: FILTER SHIFTS BASED ON THE WEEK??
    setTableScheduledShiftIDs(assignedShifts);
  }
  
  return (
    <React.Fragment>
      <Stack direction={'row'}>
        <Box sx={{ flexGrow: 3 }}>
        {
          usersInHouse && <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={usersInHouse.ids as EntityId[]}
            renderInput={(params) => <TextField {...params} label="Select a User" />}
            getOptionLabel = {(option) => extractName(option)}
            onChange = {updateSelectedUserAndShiftIDs}
            sx = {{
              width: 450,
              'backgroundColor': 'white',
              marginBottom: '2.5%'
            }}
          />
        }
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>
      {scheduledShifts && tableScheduledShiftIDs && tableScheduledShiftIDs.length > 0 &&
          <IndividualScheduledShifts scheduledShiftIDs={tableScheduledShiftIDs} scheduledShiftDictionary = {scheduledShifts.entities}/>
      }
      {
        selectedUserID === "" &&
        <SearchForMemberDisplay />
      }
      {
        selectedUserID !== "" && tableScheduledShiftIDs && tableScheduledShiftIDs.length === 0 &&
        <NoScheduleFoundDisplay />
      }
    </React.Fragment> 
  )
}

export default ManagerIndividualTabContent 