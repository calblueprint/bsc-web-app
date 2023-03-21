//** React Hooks */
import React, { useEffect, useState } from 'react'

//** Materials UI Components */
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

//** Material UI Icon */
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SettingsIcon from '@mui/icons-material/Settings'

//** Hooks */
import { useSelector, useDispatch } from 'react-redux'

//** React Redux */
import { selectCurrentRole } from '../../features/auth/authSlice'
import {
    setMemberNavState,
    selectMemberNavState,
    setManagerNavState,
    selectManagerNavState,
    setSupervisorNavState,
    selectSupervisorNavState,
} from '../../features/user/usersSlice'

//** Constant Variables */
import { memberCategories, managerCategories, supervisorCategories } from './constants'

//** Interfaces */
import { useRouter } from 'next/router'

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
}

// const icons = {
//     Dashboard: <DashboardCustomizeRoundedIcon />,
//     Schedule: <CalendarMonthRoundedIcon />,
//     Planner: <CalendarMonthRoundedIcon />,
//     Profile: <SettingsIcon />,
//     Marketplace: <StorefrontRoundedIcon />,
// }

const getIcon = (iconName: string): React.ReactElement | null => {
    switch (iconName) {
        case 'Dashboard':
            return <DashboardCustomizeRoundedIcon />
        case 'Schedule':
        case 'Planner':
            return <CalendarMonthRoundedIcon />
        case 'Profile':
            return <SettingsIcon />
        case 'Marketplace':
            return <StorefrontRoundedIcon />
        default:
            return null
    }
}

interface MemberCategory {
    id: string
    children: MemberCategoryChild[]
}

interface MemberCategoryChild {
    id: string
    path: string
    active: number
    icon: React.ReactElement
}

/**
 * @des Displays and responds to user interaction for the navegation
 * @param props
 * @returns
 */
const NavButtons = () => {
    const memberNavState = useSelector(selectMemberNavState)
    const managerNavState = useSelector(selectManagerNavState)
    const supervisorNavState = useSelector(selectSupervisorNavState)
    const dispatch = useDispatch()

    const currentRole = useSelector(selectCurrentRole)
    const [activeButton, setActiveButton] = useState(memberNavState.active)
    // const [goTo, setGoTo] = useState(memberNavState.path)
    const [categories, setCategories] = useState(memberCategories)
    // const nav = useGoToRoute()
    const router = useRouter()

    const chooseCategory = {
        member: memberCategories,
        manager: managerCategories,
        supervisor: supervisorCategories,
    }

    const chooseSetNavFunction = {
        member: setMemberNavState,
        manager: setManagerNavState,
        supervisor: setSupervisorNavState,
    }

    const chooseNavState = {
        member: memberNavState,
        manager: managerNavState,
        supervisor: supervisorNavState,
    }

    // const handleClick = (id: string) => {
    //     categories.forEach((category) => {
    //         category.children.forEach((btn) => {
    //             if (btn.id === id) {
    //                 dispatch(
    //                     chooseSetNavFunction[currentRole]({
    //                         ...chooseNavState[currentRole],
    //                         id: btn.id,
    //                         active: btn.active,
    //                         path: btn.path,
    //                         tab: 0,
    //                     })
    //                 )
    //                 // setGoTo(btn.path)
    //                 setActiveButton(btn.active)
    //                 // nav(btn.path)
    //                 router.push(btn.path)
    //             }
    //         })
    //     })
    // }
    const handleClick = (id: string) => {
        categories.forEach((category) => {
            category.children.forEach((btn) => {
                if (btn.id === id) {
                    console.log('[NavButtons]: currentRole: ', currentRole)
                    dispatch(
                        chooseSetNavFunction[currentRole as keyof typeof chooseSetNavFunction]({
                            ...chooseNavState[currentRole as keyof typeof chooseNavState],
                            id: btn.id,
                            active: btn.active,
                            path: btn.path,
                            tab: 0,
                        })
                    )
                    setActiveButton(btn.active)
                    // router.push(btn.path)
                }
            })
        })
    }

    // useEffect(() => {
    //     // Navigate to the given path TOGO
    // }, [goTo])

    // useEffect(() => {
    //     // console.log('currentRole changed to: ', currentRole)
    //     const state = chooseNavState[currentRole]
    //     setCategories(chooseCategory[currentRole])
    //     // setGoTo(state.path)
    //     setActiveButton(state.active)
    //     // nav(state.path)
    //     router.push(state.path)
    // }, [currentRole])
    useEffect(() => {
        if (currentRole) {
            console.log('[NavButtons]: currentRole: ', currentRole)
            const state = chooseNavState[currentRole as keyof typeof chooseNavState]
            setCategories(chooseCategory[currentRole as keyof typeof chooseCategory])
            setActiveButton(state.active)
            router.push(state.path)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRole])

    // useEffect(() => {
    //     console.log('Mounting NavButtons')
    //     return () => {
    //         console.log('Unmounting NavButtons')
    //     }
    // }, [])
    //TODO: Delete after testing ********************************

    let buttons = categories?.map(({ id, children }) => (
        <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
                <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, active }) => {
                const isActive = active === activeButton ? true : false
                return (
                    <ListItem disablePadding key={childId}>
                        <ListItemButton
                            selected={isActive}
                            sx={item}
                            onClick={() => handleClick(childId)}
                        >
                            {/* <ListItemIcon>{icons[childId]}</ListItemIcon> */}
                            <ListItemIcon>{getIcon(childId)}</ListItemIcon>
                            <ListItemText>{childId}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                )
            })}
            <Divider sx={{ mt: 2 }} />
        </Box>
    ))
    return <React.Fragment>{buttons}</React.Fragment>
}
export default NavButtons
