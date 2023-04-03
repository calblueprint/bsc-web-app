import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import MemberMembersInformationTabContent from './informationTab/MemberMembersInformationTabContent'

const MemberMembersContent = () => {
  const memberNavState = useSelector(selectMemberNavState)
  let content = null
  if (memberNavState.tab === 0) {
    content = <MemberMembersInformationTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default MemberMembersContent
