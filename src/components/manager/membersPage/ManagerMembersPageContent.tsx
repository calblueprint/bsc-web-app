import { selectManagerNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import ManagerAvailabilityTabContent from './availabilityTab/ManagerAvailabilityTabContent'
import ManagerInformationTabContent from './informationTab/ManagerInformationTabContent'

const ManagerMembersContent = () => {
  const managerNavState = useSelector(selectManagerNavState)
  let content = null
  if (managerNavState.tab === 0) {
    content = <ManagerInformationTabContent />
  } else if (managerNavState.tab === 1) {
    content = <ManagerAvailabilityTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default ManagerMembersContent
