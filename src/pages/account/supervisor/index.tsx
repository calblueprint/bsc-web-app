import Loading from '@/components/shared/Loading'
import SupervisorMembersContent from '@/components/supervisor/membersPage/SupervisorMembersPageContent'
import SupervisorPlannerContent from '@/components/supervisor/plannerPage/SupervisorPlannerPageContent'
import SupervisorScheduleContent from '@/components/supervisor/schedulePage/SupervisorSchedulePageContent'
import {
  selectCurrentRole,
  selectCurrentUser,
  setCurrentRole,
} from '@/features/auth/authSlice'
import { selectSupervisorNavState } from '@/features/user/usersSlice'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrivateLayout from '../Layout'

const SupervisorAccount = () => {
  const authUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const router = useRouter()
  const currentRole = useSelector(selectCurrentRole)
  const supervisorNavState = useSelector(selectSupervisorNavState)
  // const { isLoading: isAuthLoading, isSupervisor } = useAuth()

  useEffect(() => {
    if (authUser) {
      if (!authUser.roles?.includes('supervisor')) {
        console.log('No supervisors here *********')
        dispatch(setCurrentRole(''))
        router.replace('/')
      } else {
        if (!currentRole) {
          dispatch(setCurrentRole('supervisor'))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, currentRole])

  let content = null
  if (supervisorNavState.active === 0) {
    content = <SupervisorScheduleContent />
  } else if (supervisorNavState.active === 1) {
    content = <SupervisorPlannerContent />
  } else if (supervisorNavState.active === 2) {
    content = <SupervisorMembersContent />
  }

  return (
    <React.Fragment>
      {currentRole && authUser ? (
        <PrivateLayout>{content}</PrivateLayout>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  )
}

export default SupervisorAccount
