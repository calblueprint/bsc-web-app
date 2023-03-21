import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
    const router = useRouter()

    useEffect(() => {
        // Check if the user is logged in
        console.log('Home Component')
        router.push('/account')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <h1>Redirecting...</h1>
        </>
    )
}
