import { selectSupervisorNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import SupervisorAllShiftsTabContent from './allShiftsTab/SupervisorAllShiftsTabContent'
import SupervisorIndividualTabContent from './individualTab/SupervisorIndividualTabContent'

const SupervisorScheduleContent = () => {
  const supervisorNavState = useSelector(selectSupervisorNavState)
  let content = null
  if (supervisorNavState.tab === 0) {
    content = <SupervisorAllShiftsTabContent />
  } else if (supervisorNavState.tab === 1) {
    content = <SupervisorIndividualTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default SupervisorScheduleContent
