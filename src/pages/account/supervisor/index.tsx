import { selectCurrentRole, setCurrentRole } from '@/features/auth/authSlice'
import { selectSupervisorNavState } from '@/features/user/usersSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrivateLayout from '../Layout'

const SupervisorAccount = () => {
    const dispatch = useDispatch()
    const currentRole = useSelector(selectCurrentRole)
    const supervisorNavState = useSelector(selectSupervisorNavState)

    useEffect(() => {
        if (!currentRole) {
            dispatch(setCurrentRole('supervisor'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRole])

    let content = null
    if (supervisorNavState.active === 0) {
        content = (
            <>
                <h1>Dashboare</h1>
            </>
        )
    } else if (supervisorNavState.active === 1) {
        content = <h1>Planner</h1>
    } else if (supervisorNavState.active === 2) {
        content = <h1>Profile</h1>
    }

    return (
        <React.Fragment>
            {currentRole ? <PrivateLayout>{content}</PrivateLayout> : <h1>Loading...</h1>}
        </React.Fragment>
    )
}

export default SupervisorAccount
