import { createTheme } from '@mui/material/styles'

let theme = createTheme({
  palette: {
    primary: {
      light: '#C0C0C0',
      main: '#1A202C',
      // main: '#1A202C',
      dark: '#232323',
      // dark: '#006db3',
    },
    secondary: {
      // light: '#63ccff',

      light: '#EFEFEF',
      main: '#ffffff',
      // main: '#1A202C',
      dark: '#898989',
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
    h3: {
      fontWeight: 500,
      fontSize: 24,
      letterSpacing: 0.5,
      font: 'Inter',
      fontStyle: 'normal',
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
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#656565',
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: '#E2E2E2',
          '&:before': {
            borderColor: '#E2E2E2',
          },
          '&:after': {
            borderColor: '#E2E2E2',
          },
        },
      },
    },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     notchedOutline: {
    //       border: 'none',
    //     },
    //   },
    // },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#EFEFEF', //theme.palette.primary.light,
          '& .MuiToggleButton-root': {
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            backgroundColor: 'transparent',
            '&.Mui-selected': {
              color: theme.palette.secondary.main,
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      },
    },
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
          borderRadius: '4px',
          marginLeft: 'auto',
          marginBottom: 2,
          fontSize: '16px',
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
export default theme
