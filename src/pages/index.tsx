import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/shared/Loading'

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  const router = useRouter()
  const authUser = useSelector(selectCurrentUser)

  useEffect(() => {
    // Check if the user is logged in
    // console.log('[Home Component] authUser: ' + authUser, isMember, isManager, isSupervisor)
    // router.push('/account')

    if (authUser) {
      const roles = authUser.roles
      console.log('[Home Page]: roles: ', roles)
      if (roles.includes('supervisor')) {
        router.replace('/account/supervisor')
      } else if (roles.includes('manager')) {
        router.replace('/account/manager')
      } else if (roles.includes('member')) {
        router.replace('/account/member')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser])
  return <Loading />
}
