import { selectManagerNavState } from '@/features/user/usersSlice'
import { useSelector } from 'react-redux'

const ManagerScheduleContent = () => {
    const managerNavState = useSelector(selectManagerNavState)
    let content = null
    if (managerNavState.tab === 0) {
        content = <h1>All Shifts Content</h1>
    } else if (managerNavState.tab === 1) {
        content = <h1>Individual Content</h1>
    } else {
        content = <h1>Error</h1>
    }
    return content
}
export default ManagerScheduleContent
