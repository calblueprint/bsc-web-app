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
import PersonIcon from '@mui/icons-material/Person'

//** Redux API Slices */
import { useAuthLogOutMutation } from '../../../features/auth/authApiSlice'
import { useGetHouseQuery } from '../../../features/house/houseApiSlice'

//** Custom Hooks */
// import useAuth from '../../hooks/useAuth'

//** Custom Components */
import NavButtons from './NavButtons'

//** Interfaces */
import { NavP } from '../../../interfaces/interfaces'
import { House, User } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentRole,
  selectCurrentUser,
  setCurrentRole,
} from '@/features/auth/authSlice'
import { useRouter } from 'next/router'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import useUserRolePath from '@/hooks/useUserRolePath'
import useAuth from '@/hooks/useAuth'
import { capitalizeFirstLetter } from '@/utils/utils'

const item = {
  py: '2px',
  px: 3,
  // color: 'rgba(255, 255, 255, 0.7)',
  // '&:hover, &:focus': {
  //     bgcolor: 'rgba(255, 255, 255, 0.08)',
  // },
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

  // Get current authUser from redux state
  // const { authUser } = useAuth()
  const authUser = useSelector(selectCurrentUser) as User
  const userRole = useSelector(selectCurrentRole)
  const dispatch = useDispatch()

  const { isManagerPath, isMemberPath, isSupervisorPath } = useUserRolePath()
  const { isManager, isMember, isSupervisor } = useAuth()

  const {
    data: houseEntity,
    isSuccess: isHouseSuccess,
    isLoading: isHouseLoading,
    isError: isHouseError,
    error: houseError,
  } = useGetHouseQuery(authUser?.houseID)

  const [houseName, setHouseName] = useState('BSC')

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useAuthLogOutMutation()
  const router = useRouter()
  // const nav = useGoToRoute()
  //***************** */
  const handleMemberClick = () => {
    if (isMember) {
      dispatch(setCurrentRole('member'))
    }
  }
  const handleManagerClick = () => {
    if (isManager) {
      dispatch(setCurrentRole('manager'))
    }
  }
  const handleSupervisorClick = () => {
    if (isSupervisor) {
      dispatch(setCurrentRole('supervisor'))
    }
  }
  //****************** */

  const handleLogout = () => {
    sendLogout({})
  }

  useEffect(() => {
    return () => {
      if (isSuccess) {
        // nav('/')
        // console.log('logged out successfully')
        router.replace('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (houseEntity && authUser) {
      // console.log(houseEntity, authUser)
      const house = houseEntity.entities[authUser.houseID] as House
      // console.log(house)
      if (house) {
        // console.log(house.name)
        setHouseName(house.name)
      }
    }
  }, [houseEntity, authUser])

  //TODO: Delete after testing ******************************
  // useEffect(() => {
  //     console.log('Mounting Navbar')
  //     return () => {
  //         console.log('Unmounting Navbar')
  //     }
  // }, [])
  //TODO: Delete after testing ********************************

  let content: ReactNode
  if (isLoading) {
    content = <h2>Logging Out...</h2>
  } else if (isError) {
    if (!error) {
      content = <h2>Error: ??</h2>
    } else {
      content = <div>Error</div>
    }
  } else {
    content = (
      <Drawer variant="permanent" {...other}>
        <List
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'flex-start',
          }}
        >
          <ListItem
            sx={{
              ...itemCategory,
              py: 1.5,
              px: 3,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <ListItemIcon sx={{ fontSize: 28 }}>
              <HomeIcon />
            </ListItemIcon>
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 4 }}>
              <Typography variant="subtitle1" fontWeight={'bold'}>
                {authUser.preferredName
                  ? authUser.preferredName
                  : `${authUser.firstName} ${authUser.lastName}`}
              </Typography>
              <Typography variant="body2">
                {`${houseName} ${
                  userRole ? capitalizeFirstLetter(userRole) : 'User'
                }`}
              </Typography>
            </Box>
          </ListItem>

          <NavButtons />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ bgcolor: '#101F33' }}>
            <ListItem disablePadding>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <ListItemButton
                      sx={{ ...item, ...itemCategory }}
                      {...bindTrigger(popupState)}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText>Switch User Role</ListItemText>
                    </ListItemButton>

                    <Menu
                      {...bindMenu(popupState)}
                      // anchorOrigin={{
                      //     vertical: 'bottom',
                      //     horizontal: 'left',
                      // }}
                      // transformOrigin={{
                      //     vertical: 'top',
                      //     horizontal: 'left',
                      // }}
                    >
                      {isMember && !isMemberPath ? (
                        <MenuItem
                          onClick={() => {
                            handleMemberClick()
                            popupState.close
                          }}
                        >
                          Member
                        </MenuItem>
                      ) : null}
                      {isManager && !isManagerPath ? (
                        <MenuItem
                          onClick={() => {
                            handleManagerClick()
                            popupState.close
                          }}
                        >
                          Manager
                        </MenuItem>
                      ) : null}

                      {isSupervisor && !isSupervisorPath ? (
                        <MenuItem
                          onClick={() => {
                            handleSupervisorClick()
                            popupState.close()
                          }}
                        >
                          Supervisor
                        </MenuItem>
                      ) : null}
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </ListItem>
          </Box>

          <Box sx={{ bgcolor: '#101F33' }}>
            <ListItem disablePadding onClick={handleLogout}>
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

//{() => sendLogout(null)}>
