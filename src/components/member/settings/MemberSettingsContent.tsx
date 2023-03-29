import { selectMemberNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import MemberAvailabilityTab from './availabilityTab/MemberAvailabilityTab'

const MemberSettingsContent = () => {
    const memberNavState = useSelector(selectMemberNavState)
    let content = null
    if (memberNavState.tab === 0) {
        content = <h1>Information Content</h1>
    } else if (memberNavState.tab === 1) {
        content = <MemberAvailabilityTab />
    } else if (memberNavState.tab === 2) {
        content = <h1>Preferences Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default MemberSettingsContent
