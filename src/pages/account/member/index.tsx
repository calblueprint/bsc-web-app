import Loading from '@/components/shared/Loading'
import { selectCurrentRole, setCurrentRole } from '@/features/auth/authSlice'
import { selectMemberNavState } from '@/features/user/usersSlice'
// import ReduxTesting from '@/pages/ReduxTesting'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrivateLayout from '../Layout'

const MemberAccount = () => {
    const dispatch = useDispatch()
    const currentRole = useSelector(selectCurrentRole)
    const memberNavState = useSelector(selectMemberNavState)

    useEffect(() => {
        if (!currentRole) {
            dispatch(setCurrentRole('member'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRole])

    let content = null
    if (memberNavState.active === 0) {
        content = (
            <>
                <h1>Dashboare</h1>
            </>
        )
    } else if (memberNavState.active === 1) {
        content = <h1>Planner</h1>
    } else if (memberNavState.active === 2) {
        content = <h1>Profile</h1>
    }

    return (
        <React.Fragment>
            {currentRole ? <PrivateLayout>{content}</PrivateLayout> : <Loading />}
        </React.Fragment>
    )
}

export default MemberAccount
