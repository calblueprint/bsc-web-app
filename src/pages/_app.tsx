// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthState } from '@/features/auth/AuthState'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { useEffect } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

let theme = createTheme({
    palette: {
        primary: {
            // light: '#63ccff',

            light: '#C0C0C0',
            main: '#1A202C',
            // main: '#1A202C',
            dark: '#232323',
            // dark: '#006db3',
        },
        secondary: {
            // light: '#63ccff',

            light: '#C0C0C0',
            main: '#ffffff',
            // main: '#1A202C',
            dark: '#232323',
            // dark: '#006db3',
        },
    },
    typography: {
        h5: {
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: 0.5,
            font: 'Inter',
        },
        subtitle1: {
            fontWeight: 500,
            font: 'Inter',
            fontSize: 20,
            letterSpacing: 0.5,
            color: '#ffffff',
        },
    },

    shape: {
        borderRadius: 8,
    },
    components: {
        MuiTab: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
})

theme = {
    ...theme,
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#081627',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
                contained: {
                    boxShadow: 'none',
                    '&:active': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    marginLeft: theme.spacing(1),
                },
                indicator: {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    backgroundColor: theme.palette.primary.dark,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    margin: '0 16px',
                    minWidth: 0,
                    padding: 0,
                    [theme.breakpoints.up('md')]: {
                        padding: 0,
                        minWidth: 0,
                    },
                    fontSize: '18px',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(1),
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 4,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgb(255,255,255,0.15)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: theme.palette.secondary.main,
                        borderLeft: `5px solid ${theme.palette.secondary.main}`,
                    },
                    color: theme.palette.primary.light,
                    '&:hover, &:focus': { color: theme.palette.secondary.main },
                },
            },
        },
        // MuiListItem: {
        //     styleOverrides: {
        //         root: {
        //             '&.Mui-selected': {
        //                 color: theme.palette.primary.main,
        //             },
        //             color: theme.palette.primary.light,
        //             '&:hover, &:focus': { color: theme.palette.primary.main },
        //         },
        //     },
        // },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontSize: 16,
                    fontWeight: theme.typography.fontWeightMedium,
                    // color: theme.palette.primary.light,
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: 'inherit',
                    minWidth: 'auto',
                    marginRight: theme.spacing(2),
                    '& svg': {
                        fontSize: 26,
                    },
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    width: 32,
                    height: 32,
                },
            },
        },
    },
}

export default function App({ Component, pageProps }: AppProps) {
    // useEffect(() => {
    //     console.log('App Component')
    // }, [])
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthState>
                    <Component {...pageProps} />
                </AuthState>
            </ThemeProvider>
        </Provider>
    )
}
