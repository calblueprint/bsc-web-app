import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import MemberAvailabilityTabContent from './availabilityTab/MemberAvailabilityTabContent'
import MemberInformationTabContent from './informationTab/MemberSettingsInformationTabContent'
import MemberSettingsPreferencesTabContent from './preferencesTab/MemberPreferencesTabContent'

const MemberSettingsContent = () => {
  const memberNavState = useSelector(selectMemberNavState)
  let content = null
  if (memberNavState.tab === 0) {
    content = <MemberInformationTabContent />
  } else if (memberNavState.tab === 1) {
    content = <MemberAvailabilityTabContent />
  } else if (memberNavState.tab === 2) {
    content = <MemberSettingsPreferencesTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default MemberSettingsContent
