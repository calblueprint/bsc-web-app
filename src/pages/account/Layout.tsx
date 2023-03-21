import * as React from 'react'
import { ReactNode, useEffect, useState } from 'react'

//** React Router imports */

//** Materials UI components */
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
// import AppBar from '@mui/material/AppBar'

//** Materials UI styles */
import { useTheme } from '@mui/material/styles'

//** Custom components */
import Copyright from '@/components/shared/Copyright'
import NavBar from '@/components/shared/NavBar'
import Header from '@/components/shared/Header'

type Props = {
    children: ReactNode
}
//** NavBar width constant */
const drawerWidth = 230 //256

/**
 *
 * @param param0
 * @returns
 */
export default function PrivateLayout({ children }: Props) {
    /** Materials UI styles */
    const theme = useTheme()
    // TODO: Add description
    const [mobileOpen, setMobileOpen] = React.useState(false)

    // TODO: Add description
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

    // TODO: Add description
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    //TODO: Delete after testing ******************************
    // useEffect(() => {
    //     console.log('Mounting PrivateLayout')
    //     return () => {
    //         console.log('Unmounting PrivateLayout')
    //     }
    // }, [])
    //TODO: Delete after testing ********************************

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                    {isSmUp ? null : (
                        <NavBar
                            PaperProps={{ style: { width: drawerWidth } }}
                            variant='temporary'
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                        />
                    )}
                    <NavBar
                        PaperProps={{ style: { width: drawerWidth } }}
                        sx={{ display: { sm: 'block', xs: 'none' } }}
                    />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header onDrawerToggle={handleDrawerToggle} />
                    <Box component='main' sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
                        {children}
                    </Box>
                    <Box component='footer' sx={{ p: 2, bgcolor: '#eaeff1' }}>
                        <Copyright />
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    )
}
