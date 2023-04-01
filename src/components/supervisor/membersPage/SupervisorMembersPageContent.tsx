import { selectSupervisorNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import SupervisorAvailabilityTabContent from './availabilityTab/SupervisorAvailabilityTabContent'
import SupervisorInformationTabContent from './informationTab/SupervisorInformationTabContent'

const SupervisorMembersContent = () => {
  const supervisorNavState = useSelector(selectSupervisorNavState)
  let content = null
  if (supervisorNavState.tab === 0) {
    content = <SupervisorInformationTabContent />
  } else if (supervisorNavState.tab === 1) {
    content = <SupervisorAvailabilityTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default SupervisorMembersContent
