import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/clientApp'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useAuth = () => {
  const authUser = useSelector(selectCurrentUser)
  const [isManager, setIsManager] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isSupervisor, setIsSupervisor] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const goToRole = () => {
    if (authUser && (isMember || isManager || isSupervisor)) {
      if (isSupervisor) {
        router.replace('/account/supervisor')
      } else if (isManager) {
        router.replace('/account/manager')
      } else if (isMember) {
        router.replace('/account/member')
      }
    }
  }

  useEffect(() => {
    if (authUser) {
      // console.log('[useAuth]: authUser', authUser)
      const roles: string[] = authUser.roles
      if (roles && roles.length > 0) {
        // console.log('[useAuth]: roles', roles)
        setIsManager(roles.includes('manager'))
        setIsSupervisor(roles.includes('supervisor'))
        setIsMember(roles.includes('member'))
        setIsLoading(false)
      }
    }
  }, [authUser])

  // console.log(isSupervisor, isMember, isManager)

  return { isManager, isSupervisor, isMember, goToRole, isLoading }
}

export default useAuth
