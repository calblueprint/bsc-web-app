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
import useGoToRoute from '../../hooks/useGoToRoute'

//** Redux API Slices */
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import { useGetHouseByIdQuery } from '../../features/houses/housesApiSlice'

//** Custom Hooks */
import useAuth from '../../hooks/useAuth'

//** Custom Components */
import NavButtons from './NavButtons'

//** Interfaces */
import { NavP, House } from '../../interfaces/interfaces'

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
    const { user } = useAuth()

    const {
        data: house,
        isSuccess: isHouseSuccess,
        isLoading: isHouseLoading,
        isError: isHouseError,
        error: houseError,
    } = useGetHouseByIdQuery<{
        data: House
        isSuccess: Boolean
        isLoading: Boolean
        isError: Boolean
        error: any
    }>(user?.active_house_id)

    const [houseName, setHouseName] = useState('BSC')

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()
    const nav = useGoToRoute()

    useEffect(() => {
        if (isSuccess) {
            console.log('logged out')
            nav('/')
        }
        return () => {
            if (isSuccess) {
                nav('/')
            }
        }
    }, [isSuccess])

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
                        <ListItemText>{`${
                            isHouseSuccess ? house.name : 'BSC'
                        } House`}</ListItemText>
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
