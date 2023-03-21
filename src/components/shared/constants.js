export const memberTabs = {
    Dashboard: [{ id: 'Overview' }, { id: 'Actions' }],
    Schedule: [{ id: 'Overview' }, { id: 'Tab2' }],
    Marketplace: [{ id: 'Overview' }, { id: 'Tab2' }],
    Profile: [{ id: 'Overview' }, { id: 'Tab2' }],
}

export const managerTabs = {
    Dashboard: [{ id: 'Overview' }, { id: 'Actions' }],
    Planner: [{ id: 'Overview' }, { id: 'Tab2' }],
    Marketplace: [{ id: 'Overview' }, { id: 'Tab2' }],
}
export const supervisorTabs = {
    Dashboard: [{ id: 'Overview' }, { id: 'Actions' }],
    Planner: [{ id: 'Overview' }, { id: 'Tab2' }],
    Marketplace: [{ id: 'Overview' }, { id: 'Tab2' }],
}

export const MemberContent = [
    {
        id: 'Dashboard',
        path: '/account/member',
        active: 0,
        tabs: [
            {
                id: 'Overview',
                path: '/account/member/overview',
            },
            {
                id: 'Actions',
                path: '/account/member/actions',
            },
        ],
    },
    {
        id: 'Schedule',
        path: '/account/member/schedule',
        active: 1,
        tabs: [
            {
                id: 'Overview',
                path: '/account/member/schedule/overview',
            },
        ],
    },
    {
        id: 'Marketplace',
        path: '/account/member/marketplace',
        active: 2,
        tabs: [
            {
                id: 'Overview',
                path: '/account/member/marketplace/overview',
            },
        ],
    },
    {
        id: 'Profile',
        path: '/account/member/profile',
        active: 3,
        tabs: [
            {
                id: 'Overview',
                path: '/account/member/profile/overview',
            },
        ],
    },
]

export const ManagerContent = [
    {
        id: 'Dashboard',
        path: '/account/manager',
        active: 0,
        tabs: [
            {
                id: 'Overview',
                path: '/account/manager/overview',
            },
            {
                id: 'Actions',
                path: '/account/manager/actions',
            },
        ],
    },
    {
        id: 'Planner',
        path: '/account/manager/planner',
        active: 1,
        tabs: [
            {
                id: 'Overview',
                path: '/account/manager/palnner/overview',
            },
        ],
    },
    {
        id: 'Marketplace',
        path: '/account/manager/marketplace',
        active: 2,
        tabs: [
            {
                id: 'Overview',
                path: '/account/manager/marketplace/overview',
            },
        ],
    },
]

export const SupervisorContent = [
    {
        id: 'Dashboard',
        path: '/account/supervisor',
        active: 0,
        tabs: [
            {
                id: 'Overview',
                path: '/account/supervisor/overview',
            },
            {
                id: 'Actions',
                path: '/account/supervisor/actions',
            },
        ],
    },
    {
        id: 'Planner',
        path: '/account/supervisor/planner',
        active: 1,
        tabs: [
            {
                id: 'Overview',
                path: '/account/supervisor/planner/overview',
            },
        ],
    },
    {
        id: 'Marketplace',
        path: '/account/supervisor/marketplace',
        active: 2,
        tabs: [
            {
                id: 'Overview',
                path: '/account/supervisor/marketplace/overview',
            },
        ],
    },
]

export const memberCategories = [
    {
        id: 'Member',
        children: [
            {
                id: 'Dashboard',
                path: '/account/member/dashboard',
                active: 0,
            },
            {
                id: 'Schedule',
                path: '/account/member/schedule',
                active: 1,
            },
            {
                id: 'Marketplace',
                path: '/account/member/marketplace',
                active: 2,
            },
        ],
    },
    {
        id: 'Other',
        children: [
            {
                id: 'Profile',
                path: '/account/member/profile',
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
                id: 'Dashboard',
                path: '/account/manager/dashboard',
                active: 0,
            },
            {
                id: 'Planner',
                path: '/account/manager/planner',
                active: 1,
            },
            {
                id: 'Marketplace',
                path: '/account/manager/marketplace',
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
                path: '/account/supervisor/dashboard',
                active: 0,
            },
            {
                id: 'Planner',
                path: '/account/supervisor/planner',
                active: 1,
            },
            // {
            //     id: 'Marketplace',
            //     path: '/account/supervisor/marketplace',
            //     active: 2,
            // },
        ],
    },
    // {
    //     id: 'Other',
    //     children: [
    //         {
    //             id: 'Profile',
    //             path: '/account/supervisor/profile',

    //             active: 3,
    //         },
    //     ],
    // },
]

export const ROLES = ['Manager', 'Member', 'Supervisor']
