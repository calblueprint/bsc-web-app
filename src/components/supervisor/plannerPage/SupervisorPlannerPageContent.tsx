import { selectSupervisorNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'

const SupervisorPlannerContent = () => {
    const supervisorNavState = useSelector(selectSupervisorNavState)
    let content = null
    if (supervisorNavState.tab === 0) {
        content = <h1>Unassigned Content</h1>
    } else if (supervisorNavState.tab === 1) {
        content = <h1>Assigned Content</h1>
    } else if (supervisorNavState.tab === 2) {
        content = <h1>Categories Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default SupervisorPlannerContent
