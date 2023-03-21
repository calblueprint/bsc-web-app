import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/clientApp'
import { useEffect } from 'react'

const useAuth = () => {
    const authUser = useSelector(selectCurrentUser)
    let isManager = false
    let isSupervisor = false
    let isMember = false
    // let status = 'Member'

    useEffect(() => {
        if (authUser) {
            console.log('[useAuth]: authUser', authUser)
        }
    }, [authUser])

    if (authUser) {
        const roles= authUser.roles
        if (!roles || roles.length === 0) {
            return {isManager, isSupervisor, isMember }
        }
        isManager = roles.includes('Manager')
        isSupervisor = roles.includes('Supervisor')
        isMember = roles.includes('Member')

        return { isManager, isSupervisor, isMember}
    }
    return {isManager, isSupervisor, isMember }
}

export default useAuth
