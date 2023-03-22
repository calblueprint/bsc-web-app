import React, { ReactNode, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/clientApp'
import { useRouter } from 'next/router'
import { useEstablishContextMutation } from './authApiSlice'
import { useEffect } from 'react'
import { Box } from '@mui/material'

import Loading from '@/components/shared/Loading'
import Login from '@/pages/login'

type Props = {
    children: ReactNode
}
export const AuthState = ({ children }: Props) => {
    const router = useRouter()
    const [establishContext, { isLoading, isSuccess, isError, error }] =
        useEstablishContextMutation()

    const [isAuthorized, setIsAuthorized] = useState(false)
    const [authUser, setAuthUser] = useState({})

    useEffect(() => {
        // console.log('*****AuthState Component ran')

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // console.log('[AuthState]: Authorized User: ' + user)
                setAuthUser(user)
                await establishContext(user.uid)
                setIsAuthorized(true)

                // console.log('Error: ', error)
            } else {
                // console.log('[]AuthState]: Not authorized')
                // router.replace('/login')
                setIsAuthorized(false)
                window.history.replaceState(null, 'Log In', '/login')
            }
        })
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // console.log('[AuthState]: authUser: ', authUser)
    }, [authUser, isSuccess])

    let content = null
    if (isLoading) {
        content = <Loading />
    } else if (isError) {
        console.log(error)
        content = <Box>There was an Error </Box>
    } else if (isSuccess && isAuthorized) {
        content = <React.Fragment>{authUser ? children : null}</React.Fragment>
    } else if (!isLoading && !isAuthorized) {
        content = (
            <React.Fragment>
                <Login />
            </React.Fragment>
        )
    } else {
        content = <React.Fragment>unknown error</React.Fragment>
    }

    return content
}
