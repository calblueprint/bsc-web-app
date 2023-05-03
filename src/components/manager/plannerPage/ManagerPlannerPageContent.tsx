import { selectManagerNavState } from '@/features/user/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import ManagerAssignedTabContent from './assignedTab/ManagerAssignedTabContent'
import ManagerCategoriesTabContent from './categoriesTab/ManagerCategoriesTabContent'
import ManagerUnassignedTabContent from './unassignedTab/ManagerUnassignedTabContent'
import ManagerTentativeScheduleTabContent from './tentativeScheduleTab/ManagerTentativeScheduleTabContent'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import {
  setAssignedUserShifts,
  setEmptyShifts,
  setUsersSchedule,
} from '@/features/tentativeSchedule/scheduleSlice'
import { useGetUsersQuery } from '@/features/user/userApiSlice'
import {
  findAssignedShiftsForUsers,
  findAvailableShiftsForUsers,
  findEmptyShifts,
} from '@/utils/utils'
import { useEffect } from 'react'
import { EntityId } from '@reduxjs/toolkit'
import { selectCurrentHouse } from '@/features/auth/authSlice'

const ManagerPlannerContent = () => {
  const managerNavState = useSelector(selectManagerNavState)
  const houseId = useSelector(selectCurrentHouse)?.id ?? ''
  const { data: shifts } = useGetShiftsQuery(houseId)
  const { data: users } = useGetUsersQuery({})
  const dispatch = useDispatch()
  useEffect(() => {
    if (users && shifts) {
      const usersSchedule = findAvailableShiftsForUsers(users, shifts)
      const assignedShifts = findAssignedShiftsForUsers(users, shifts)
      const emptyShifts = findEmptyShifts(shifts)
      dispatch(setUsersSchedule({ usersSchedule }))
      dispatch(setAssignedUserShifts(assignedShifts))
      dispatch(setEmptyShifts(emptyShifts))
    }
  }, [users, shifts, dispatch])
  let content = null

  if (managerNavState.tab === 0) {
    content = <ManagerTentativeScheduleTabContent />
  } else if (managerNavState.tab === 1) {
    content = <ManagerUnassignedTabContent />
  } else if (managerNavState.tab === 2) {
    content = <ManagerAssignedTabContent />
  } else if (managerNavState.tab === 3) {
    content = <ManagerCategoriesTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default ManagerPlannerContent
