import { selectManagerNavState } from '@/features/user/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import ManagerAllShiftsTabContent from './allShiftsTab/ManagerAllShiftsTabContent'
import ManagerIndividualTabContent from './individualTab/ManagerIndividualTabContent'
import { useEffect } from 'react'
import {
  setHasWeekSelectBtn,
  setWeeklyScheduleShifts,
} from '@/features/scheduledShift/scheduledShiftSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { House } from '@/types/schema'
import { sortShiftsByWeekNumber } from '@/utils/utils'

const ManagerScheduleContent = () => {
  const authHouse = useSelector(selectCurrentHouse) as House
  const managerNavState = useSelector(selectManagerNavState)
  const { data: scheduledShift } = useGetScheduledShiftsQuery(authHouse?.id)
  const dispatch = useDispatch()

  useEffect(() => {
    if (scheduledShift) {
      const sortedShifts = sortShiftsByWeekNumber(scheduledShift)
      dispatch(setWeeklyScheduleShifts(sortedShifts))
    }
  }, [scheduledShift, dispatch])

  useEffect(() => {
    // console.log('Mounting ManagerScheduleContent')
    dispatch(setHasWeekSelectBtn(true))
    return () => {
      dispatch(setHasWeekSelectBtn(false))
    }
  }, [dispatch])

  let content = null
  if (managerNavState.tab === 0) {
    content = <ManagerAllShiftsTabContent />
  } else if (managerNavState.tab === 1) {
    content = <ManagerIndividualTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default ManagerScheduleContent
