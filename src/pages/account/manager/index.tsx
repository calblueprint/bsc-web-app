import React, { useEffect } from 'react'
import PrivateLayout from '../Layout'
import ReduxTesting from '@/pages/ReduxTesting'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentRole, selectCurrentUser, setCurrentRole } from '@/features/auth/authSlice'
import { selectManagerNavState } from '@/features/user/usersSlice'
import Loading from '@/components/shared/Loading'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/router'

const ManagerAccount = () => {
    const authUser = useSelector(selectCurrentUser)
    const currentRole = useSelector(selectCurrentRole)
    const managerNavState = useSelector(selectManagerNavState)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (authUser) {
            if (!authUser.roles?.includes('manager')) {
                console.log('No managers here *********')
                dispatch(setCurrentRole(''))
                router.replace('/')
            } else {
                if (!currentRole) {
                    dispatch(setCurrentRole('manager'))
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, currentRole])

    let content = null
    if (managerNavState.active === 0) {
        content = (
            <>
                <h1>Dashboare</h1>
                <ReduxTesting />
            </>
        )
    } else if (managerNavState.active === 1) {
        content = <h1>Planner</h1>
    } else if (managerNavState.active === 2) {
        content = <h1>Profile</h1>
    }

    return (
        <React.Fragment>
            {currentRole && authUser ? <PrivateLayout>{content}</PrivateLayout> : <Loading />}
        </React.Fragment>
    )
}

export default ManagerAccount
