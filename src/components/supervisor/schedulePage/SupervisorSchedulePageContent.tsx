import { selectSupervisorNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'

const SupervisorScheduleContent = () => {
    const supervisorNavState = useSelector(selectSupervisorNavState)
    let content = null
    if (supervisorNavState.tab === 0) {
        content = <h1>All Shifts Content</h1>
    } else if (supervisorNavState.tab === 1) {
        content = <h1>Individual Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default SupervisorScheduleContent
