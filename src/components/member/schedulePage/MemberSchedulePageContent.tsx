import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import MemberAllShiftsTabContent from './allShiftsTab/MemberAllShiftsTabContent'
import MemberIndividualTabContent from './individualTab/MemberIndividualTabContent'

const MemberScheduleContent = () => {
  const memberNavState = useSelector(selectMemberNavState)
  let content = null
  if (memberNavState.tab === 0) {
    content = <MemberIndividualTabContent />
  } else if (memberNavState.tab === 1) {
    content = <MemberAllShiftsTabContent />
  } else {
    content = <h1>Error</h1>
  }
  return content
}
export default MemberScheduleContent
