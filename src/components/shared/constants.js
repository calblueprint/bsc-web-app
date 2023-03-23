import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SettingsIcon from '@mui/icons-material/Settings'

export const memberTabs = {
    Schedule: [{ id: 'Overview' }, { id: 'Tab2' }],
    Members: [{ id: 'Overview' }, { id: 'Tab2' }],
    Settings: [{ id: 'Overview' }, { id: 'Tab2' }],
}

export const managerTabs = {
    Schedule: [{ id: 'All Shifts' }, { id: 'Individual' }],
    Planner: [{ id: 'Unassigned' }, { id: 'Assigned' }],
    Members: [{ id: 'Information' }, { id: 'Availability' }],
}
export const supervisorTabs = {
    Dashboard: [{ id: 'Overview' }, { id: 'Actions' }],
    Planner: [{ id: 'Overview' }, { id: 'Tab2' }],
    Marketplace: [{ id: 'Overview' }, { id: 'Tab2' }],
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
                id: 'Dashboard',
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
            // {
            //     id: 'Marketplace',
            //     path: '/account/supervisor',
            //     active: 2,
            // },
        ],
    },
    // {
    //     id: 'Other',
    //     children: [
    //         {
    //             id: 'Profile',
    //             path: '/account/supervisor',

    //             active: 3,
    //         },
    //     ],
    // },
]

const icons = {
    Dashboard: <DashboardCustomizeRoundedIcon />,
    Schedule: <CalendarMonthRoundedIcon />,
    Planner: <CalendarMonthRoundedIcon />,
    Profile: <SettingsIcon />,
    Marketplace: <StorefrontRoundedIcon />,
}

export const ROLES = ['Manager', 'Member', 'Supervisor']
