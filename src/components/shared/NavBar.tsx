//** React Hooks */
import React, { ReactNode, useEffect, useState } from 'react'

//** Materials UI Components */
import Drawer, { DrawerProps } from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

//** Materials UI Icons */
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
// import useGoToRoute from '../../hooks/useGoToRoute'

//** Redux API Slices */
import { useAuthLogOutMutation } from '../../features/auth/authApiSlice'
import { useGetHouseQuery } from '../../features/house/houseApiSlice'

//** Custom Hooks */
// import useAuth from '../../hooks/useAuth'

//** Custom Components */
import NavButtons from './NavButtons'

//** Interfaces */
import { NavP } from '../../interfaces/interfaces'
import { House, User } from '@/types/schema'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useRouter } from 'next/router'

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
}

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
}

/**
 * @des Navigation bar for the application
 * @param props
 * @returns
 */
const NavBar = (props: DrawerProps) => {
    // Destructuring component properties
    const { ...other } = props

    // Get current user from redux state
    // const { user } = useAuth()
    const user = useSelector(selectCurrentUser) as User

    const {
        data: houseEntity,
        isSuccess: isHouseSuccess,
        isLoading: isHouseLoading,
        isError: isHouseError,
        error: houseError,
    } = useGetHouseQuery(user?.houseID)

    const [houseName, setHouseName] = useState('BSC')

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useAuthLogOutMutation()
    const router = useRouter()
    // const nav = useGoToRoute()

    useEffect(() => {
        if (isSuccess) {
            console.log('logged out')
            // nav('/')
            router.replace('/')
        }
        return () => {
            if (isSuccess) {
                // nav('/')
                router.replace('/')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    useEffect(() => {
        if (houseEntity && user) {
            const house = houseEntity.entities[user.houseID] as House
            if (house) {
                setHouseName(house.name)
            }
        }
    }, [houseEntity, user])

    //TODO: Delete after testing ******************************
    // useEffect(() => {
    //     console.log('Mounting Navbar')
    //     return () => {
    //         console.log('Unmounting Navbar')
    //     }
    // }, [])
    //TODO: Delete after testing ********************************
    // if (isHouseSuccess) {
    //     console.log(house)
    // }

    let content: ReactNode
    if (isLoading) {
        content = <h2>Logg ing Out...</h2>
    } else if (isError) {
        if (!error) {
            content = <h2>Error: ??</h2>
        } else {
            content = <div>Error</div>
        }
    } else {
        content = (
            <Drawer variant='permanent' {...other}>
                <List disablePadding>
                    <ListItem
                        sx={{
                            ...item,
                            ...itemCategory,
                            fontSize: 22,
                            color: '#fff',
                        }}
                    >
                        BSC
                    </ListItem>
                    <ListItem sx={{ ...item, ...itemCategory }}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText>{`${isHouseSuccess ? houseName : 'BSC'} House`}</ListItemText>
                    </ListItem>

                    <NavButtons />

                    <Box sx={{ bgcolor: '#101F33' }}>
                        <ListItem disablePadding onClick={() => sendLogout(null)}>
                            <ListItemButton sx={{ ...item, ...itemCategory }}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText>Log Out</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </List>
            </Drawer>
        )
    }

    return content
}
export default NavBar
