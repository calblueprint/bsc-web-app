import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'

const MemberScheduleContent = () => {
    const memberNavState = useSelector(selectMemberNavState)
    let content = null
    if (memberNavState.tab === 0) {
        content = <h1>Individual Content</h1>
    } else if (memberNavState.tab === 1) {
        content = <h1>All Shifts Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default MemberScheduleContent
