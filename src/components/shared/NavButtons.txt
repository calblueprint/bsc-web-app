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

//** Custom Hooks */
import useGoToRoute from '../../hooks/useGoToRoute'

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
} from '../../features/users/usersSlice'

//** Constant Variables */
import { memberCategories, managerCategories, supervisorCategories } from './constants'

//** Interfaces */
import { NavP } from '../../interfaces/interfaces'

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
}

const icons = {
    Dashboard: <DashboardCustomizeRoundedIcon />,
    Schedule: <CalendarMonthRoundedIcon />,
    Planner: <CalendarMonthRoundedIcon />,
    Profile: <SettingsIcon />,
    Marketplace: <StorefrontRoundedIcon />,
}

interface MemberCategory {
    id: string
    children: MemberCategoryChild[]
}

interface MemberCategoryChild {
    id: string
    path: string
    active: number
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
    const nav = useGoToRoute()

    const chooseCategory = {
        Member: memberCategories,
        Manager: managerCategories,
        Supervisor: supervisorCategories,
    }

    const chooseSetNavFunction = {
        Member: setMemberNavState,
        Manager: setManagerNavState,
        Supervisor: setSupervisorNavState,
    }

    const chooseNavState = {
        Member: memberNavState,
        Manager: managerNavState,
        Supervisor: supervisorNavState,
    }

    const handleClick = (id: string) => {
        categories.forEach((category) => {
            category.children.forEach((btn) => {
                if (btn.id === id) {
                    dispatch(
                        chooseSetNavFunction[currentRole]({
                            ...chooseNavState[currentRole],
                            id: btn.id,
                            active: btn.active,
                            path: btn.path,
                            tab: 0,
                        })
                    )
                    // setGoTo(btn.path)
                    setActiveButton(btn.active)
                    nav(btn.path)
                }
            })
        })
    }

    // useEffect(() => {
    //     // Navigate to the given path TOGO
    // }, [goTo])

    useEffect(() => {
        // console.log('currentRole changed to: ', currentRole)
        const state = chooseNavState[currentRole]
        setCategories(chooseCategory[currentRole])
        // setGoTo(state.path)
        setActiveButton(state.active)
        nav(state.path)
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
                            <ListItemIcon>{icons[childId]}</ListItemIcon>
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
