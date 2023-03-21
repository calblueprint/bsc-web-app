import React, { ReactNode, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/clientApp'
import { useRouter } from 'next/router'
import { useEstablishContextMutation } from './authApiSlice'
import { useEffect } from 'react'
import { Box } from '@mui/material'

import MainLayout from '../../pages/Layout'

type Props = {
    children: ReactNode
}
export const AuthState = ({ children }: Props) => {
    const router = useRouter()
    const [establishContext, { isLoading, isSuccess, isError, error }] =
        useEstablishContextMutation()
    const [authUser, setAuthUser] = useState({})

    useEffect(() => {
        console.log('*****AuthState Component ran')

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('[AuthState]: Authorized User: ' + user)
                setAuthUser(user)
                await establishContext(user.uid)

                // console.log('Error: ', error)
            } else {
                console.log('[]AuthState]: Not authorized')
                router.replace('/login')
            }
        })
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log('[AuthState]: authUser: ', authUser)
    }, [authUser, isSuccess])

    let content = null
    if (isLoading) {
        content = <Box> Loading...</Box>
    } else if (isError) {
        console.log(error)
        content = <Box>There was an Error </Box>
    } else if (isSuccess) {
        content = <React.Fragment>{authUser ? children : null}</React.Fragment>
    } else {
        content = <React.Fragment>{children}</React.Fragment>
    }

    return content
}
