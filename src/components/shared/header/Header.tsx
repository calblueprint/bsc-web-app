import * as React from 'react'

//** Materials UI Components */
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

//** Materials UI Icons */
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'

//** React Router imports */
// import { useNavigate, useLocation } from 'react-router-dom'

//** Redux API Slice */
import {
  setCurrentRole,
  selectCurrentUser,
} from '../../../features/auth/authSlice'
import {
  setMemberNavState,
  selectMemberNavState,
  setManagerNavState,
  selectManagerNavState,
  setSupervisorNavState,
  selectSupervisorNavState,
} from '../../../features/user/usersSlice'

//** Hooks */
import { useDispatch, useSelector } from 'react-redux'

//** Custom Hooks */
import useAuth from '../../../hooks/useAuth'
// import useGoToRoute from '../../hooks/useGoToRoute'
import useUserRolePath from '../../../hooks/useUserRolePath'

//** Custom Components */
import HeaderTabs from './HeaderTabs'
import { useRouter } from 'next/router'

// import { NavP } from '../../interfaces/interfaces'

const lightColor = 'rgba(255, 255, 255, 0.7)'

function capitalizeFirstLetter(word: string) {
  if (!word || word.length < 2) return word
  return word.charAt(0).toUpperCase() + word.slice(1)
}

interface HeaderProps {
  onDrawerToggle: () => void
}

/**
 * @des Header component for the application
 * @param props
 * @returns
 */
const Header = (props: HeaderProps) => {
  const { onDrawerToggle } = props

  const { isManager, isMember, isSupervisor } = useAuth()
  const user = useSelector(selectCurrentUser)
  const memberNavState = useSelector(selectMemberNavState)
  const managerNavState = useSelector(selectManagerNavState)
  const supervisorNavState = useSelector(selectSupervisorNavState)
  // const nav = useGoToRoute()
  const router = useRouter()
  const dispatch = useDispatch()
  const [userName, setUserName] = React.useState('User')

  const { isManagerPath, isMemberPath, isSupervisorPath } = useUserRolePath()

  React.useEffect(() => {
    // console.log(user)
    if (user) {
      setUserName(user.preferredName ? user.preferredName : user.firstName)
    }
  }, [user])

  // const handleMemberClick = () => {
  //     if (isMember) {
  //         dispatch(setCurrentRole('Member'))
  //     }
  // }
  // const handleManagerClick = () => {
  //     if (isManager) {
  //         dispatch(setCurrentRole('Manager'))
  //     }
  // }
  // const handleSupervisorClick = () => {
  //     if (isSupervisor) {
  //         dispatch(setCurrentRole('Supervisor'))
  //     }
  // }

  //TODO: Delete after testing ******************************
  // React.useEffect(() => {
  //     console.log('Mounting Header')
  //     return () => {
  //         console.log('Unmounting Header')
  //     }
  // }, [])
  //TODO: Delete after testing ********************************

  return (
    <React.Fragment>
      <AppBar color="secondary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                // color='secondary'
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {isMemberPath ? memberNavState.id : null}
                {isManagerPath ? managerNavState.id : null}
                {isSupervisorPath ? supervisorNavState.id : null}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
        <HeaderTabs />
      </AppBar>
      {/* <AppBar
        // component="div"
        color="secondary"
        position="relative"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {isMemberPath ? memberNavState.id : null}
                {isManagerPath ? managerNavState.id : null}
                {isSupervisorPath ? supervisorNavState.id : null}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        color="secondary"
        // component="div"
        position="relative"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <HeaderTabs />
      </AppBar> */}
    </React.Fragment>
  )
}
export default Header
