import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SettingsIcon from '@mui/icons-material/Settings'

export const memberTabs = {
    Schedule: [{ id: 'Individual' }, { id: 'All Shifts' }],
    Members: [{ id: 'Information' }],
    Settings: [{ id: 'Information' }, { id: 'Availability' }, { id: 'Preferences' }],
}

export const managerTabs = {
    Schedule: [{ id: 'All Shifts' }, { id: 'Individual' }],
    Planner: [{ id: 'Unassigned' }, { id: 'Assigned' }, { id: 'Categories' }],
    Members: [{ id: 'Information' }, { id: 'Availability' }],
}
export const supervisorTabs = {
    Schedule: [{ id: 'All Shifts' }, { id: 'Individual' }],
    Planner: [{ id: 'Unassigned' }, { id: 'Assigned' }],
    Members: [{ id: 'Information' }, { id: 'Availability' }],
}

//** Navbar Buttons for the members */
export const memberCategories = [
    {
        id: 'Member',
        children: [
            {
                id: 'Schedule',
                path: '/account/member',
                active: 1,
                icon: <CalendarMonthRoundedIcon />,
            },
            {
                id: 'Members',
                path: '/account/member',
                active: 2,
                icon: <StorefrontRoundedIcon />,
            },
        ],
    },
    {
        id: 'Other',
        children: [
            {
                id: 'Settings',
                path: '/account/member',
                active: 3,
            },
        ],
    },
]

export const managerCategories = [
    {
        id: 'Manager',
        children: [
            {
                id: 'Schedule',
                path: '/account/manager',
                active: 0,
                icon: <DashboardCustomizeRoundedIcon />,
            },
            {
                id: 'Planner',
                path: '/account/manager',
                active: 1,
                icon: <CalendarMonthRoundedIcon />,
            },
            {
                id: 'Members',
                path: '/account/manager',
                active: 2,
            },
        ],
    },
]

export const supervisorCategories = [
    {
        id: 'Supervisor',
        children: [
            {
                id: 'Schedule',
                path: '/account/supervisor',
                active: 0,
                icon: <DashboardCustomizeRoundedIcon />,
            },
            {
                id: 'Planner',
                path: '/account/supervisor',
                active: 1,
                icon: <CalendarMonthRoundedIcon />,
            },
            {
                id: 'Members',
                path: '/account/supervisor',
                active: 2,
            },
        ],
    },
]

const icons = {
    Dashboard: <DashboardCustomizeRoundedIcon />,
    Schedule: <CalendarMonthRoundedIcon />,
    Planner: <CalendarMonthRoundedIcon />,
    Profile: <SettingsIcon />,
    Marketplace: <StorefrontRoundedIcon />,
}

export const ROLES = ['Manager', 'Member', 'Supervisor']
