import React, { useEffect } from 'react'
import PrivateLayout from '../Layout'
import ReduxTesting from '@/pages/ReduxTesting'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentRole, setCurrentRole } from '@/features/auth/authSlice'
import { selectManagerNavState } from '@/features/user/usersSlice'

const ManagerAccount = () => {
    const dispatch = useDispatch()
    const currentRole = useSelector(selectCurrentRole)
    const managerNavState = useSelector(selectManagerNavState)

    useEffect(() => {
        if (!currentRole) {
            dispatch(setCurrentRole('manager'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRole])

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
            {currentRole ? <PrivateLayout>{content}</PrivateLayout> : <h1>Loading...</h1>}
        </React.Fragment>
    )
}

export default ManagerAccount
