import { selectManagerNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'
import ManagerUnassignedTab from './unassignedTab/ManagerUnassignedTab'

const ManagerPlannerContent = () => {
    const managerNavState = useSelector(selectManagerNavState)
    let content = null
    if (managerNavState.tab === 0) {
        content = <ManagerUnassignedTab />
    } else if (managerNavState.tab === 1) {
        content = <h1>Assigned Content</h1>
    } else if (managerNavState.tab === 2) {
        content = <h1>Categories Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default ManagerPlannerContent
