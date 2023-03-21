import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

//** Custom Components */
import Layout from './Layout'

//** Redux  */
import { useSelector } from 'react-redux'

//** Redux state Slice */
import { selectCurrentUser } from '@/features/auth/authSlice'

//** Types */
import { User } from '@/types/schema'

const ROLES = ['member', 'manager', 'supervisor']

const Account = () => {
    //lets get the current role
    // Import Current Application User
    const authUser = useSelector(selectCurrentUser) as User
    const router = useRouter()

    useEffect(() => {
        if (authUser) {
            // console.log('AuthUser: ' + authUser.roles)
            // console.log('Pathname: ' + pathname)
            const roles = authUser.roles
            if (!roles || roles.length === 0) {
                console.error('[Account]: User Has no roles')
                router.replace('/login')
            } else {
                // console.log('[Account]: User  roles: ', roles)
                if (roles.includes(ROLES[2])) {
                    router.push('/account/supervisor')
                } else if (roles.includes(ROLES[1])) {
                    router.push('/account/manager')
                } else if (roles.includes(ROLES[0])) {
                    router.push('/account/member')
                } else {
                    console.error('[Account]: User Has no roles: ', roles)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser])
    return (
        <>
            {!authUser ? (
                <Layout>
                    <div>Loading...</div>
                </Layout>
            ) : null}
        </>
    )
}

export default Account
