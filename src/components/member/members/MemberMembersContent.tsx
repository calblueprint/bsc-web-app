import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'

const MemberMembersContent = () => {
    const memberNavState = useSelector(selectMemberNavState)
    let content = null
    if (memberNavState.tab === 0) {
        content = <h1>Information Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default MemberMembersContent
