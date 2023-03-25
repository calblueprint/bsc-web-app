import React from 'react'
import NewShiftBtn from '@/features/shift/buttons/NewShiftBtn'
import UnassignedShiftsTable from '@/features/shift/tables/UnassignedShiftsTable'
import PrimarySearchAppBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterSearchBar from '@/components/shared/searchBar/FilterSearchBar'
import FilterShiftByDayBtn from '@/features/shift/buttons/FilterShiftByDayBtn'
const UserTesting = () => {
    return (
        <React.Fragment>
            <NewShiftBtn />
            <FilterShiftByDayBtn />
            <FilterSearchBar />
            <UnassignedShiftsTable />
        </React.Fragment>
    )
}

export default UserTesting
