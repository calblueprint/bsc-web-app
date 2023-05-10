export const memberTabs = {
  Schedule: [{ id: 'Individual' }, { id: 'All Shifts' }],
  Members: [{ id: 'Information' }],
  Settings: [
    { id: 'Information' },
    { id: 'Availability' },
    { id: 'Preferences' },
  ],
}

export const managerTabs = {
  Schedule: [{ id: 'All Shifts' }, { id: 'Individual' }],
  Planner: [
    { id: 'Tentative Schedule' },
    { id: 'Unassigned' },
    { id: 'Assigned' },
    { id: 'Categories' },
  ],
  Members: [{ id: 'Information' }, { id: 'Availability' }],
}
export const supervisorTabs = {
  Schedule: [{ id: 'All Shifts' }, { id: 'Individual' }],
  Planner: [{ id: 'Unassigned' }, { id: 'Assigned' }, { id: 'Categories' }],
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
        active: 0,
      },
      {
        id: 'Members',
        path: '/account/member',
        active: 1,
      },
      {
        id: 'Settings',
        path: '/account/member',
        active: 2,
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
      },
      {
        id: 'Planner',
        path: '/account/manager',
        active: 1,
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
      },
      {
        id: 'Planner',
        path: '/account/supervisor',
        active: 1,
      },
      {
        id: 'Members',
        path: '/account/supervisor',
        active: 2,
      },
    ],
  },
]

export const ROLES = ['Manager', 'Member', 'Supervisor']

export const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const COMPLETE = 'Complete'
export const INCOMPLETE = 'Incomplete'
