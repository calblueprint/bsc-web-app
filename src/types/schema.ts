import dayjs, {Dayjs} from "dayjs"

export type User = {
  // this id is to help the standard table generalize the id attribute
  id: string
  // ID of the user (not stored in Firebase, attached to user)
  userID: string
  // Roles of the user
  roles: string[]
  // User prefered name //!Added this
  preferredName: string
  // Last Name
  lastName: string
  // First Name
  firstName: string
  // full name that gets displayed
  displayName: string
  // User email
  email: string
  // The houseID of the house that the user resides in
  houseID: string
  // Hours the user has been assigned
  hoursAssigned: number
  // Shifts that the user has been assigned
  // TODO: this should be taken off since we will be listing the actual scheduled shifts instead of the general shifts
  shiftsAssigned?: string[]
  // Pin Number for verifying other people's tasks
  pinNumber: number
  // Map of availabilities (day: time windows when they're free)
  availabilities: { [key: string]: { startTime: string; endTime: string }[] }

  // {
  //   sunday: {startTime: string, endTime: string}[]
  //   monday: {startTime: string, endTime: string}[]
  //   tuesday: {startTime: string, endTime: string}[]
  //   wednesday: {startTime: string, endTime: string}[]
  //   thursday: {startTime: string, endTime: string}[]
  //   friday: {startTime: string, endTime: string}[]
  //   saturday: {startTime: string, endTime: string}[]
  // } //{startTime: 'endTime'}}//Record<string, number>//{ day: number[] }[]
  // Map of preferences (taskID: (0/1/2 (higher number = greater preference)))
  preferences: Record<string, string>[] //{ taskID: number }[]
  // The scheduled shifts that the user has been assigned
  assignedScheduledShifts: string[]
  // Missed workshift hours this user has missed this current week
  weekMissedHours: number
  // Hours that manager has added to this user as a penatly for missing a shift this current week
  weekPenaltyHours: number
  // The running total of missed workshift hours for the whole semester
  runningTotalMissedHours: number
  // The running total of penalty hours for the whole semester
  runningTotalPenatlyHours: number
}

export type AuthorizedUser = {
  applicationID: string
  email: string
  firstName: string
  lastName: string
  houseID: string
  accountCreated: boolean
}

export type Shift = {
  // optional id attribute for table stuff
  id: string
  // Name of the shift
  name: string //! Form Item
  // ID of the shift (not stored in Firebase, attached to shift)
  shiftID: string
  // Description of the shift
  description: string //! Form Item
  // Possible days that the shift can be done on
  possibleDays: string[]
  // Time window that this shift must be done in [startTime, endTime]
  timeWindow: { startTime: number; endTime: number }
  // property to display timeWindow
  timeWindowDisplay: string //Todo: Maybe delete this property
  // Day that the shift is assigned
  assignedDay: string
  // User assigned to the shift
  assignedUser: string
  // Hours earned for a user
  hours: number //! Form Item
  // Number of hours since end time that you are allowed to verify a shift for
  verificationBuffer: number //! Form Item
  // Verification
  verification: boolean
  // Category of work that the shift belongs to
  category: string
  // User preferences
  preferences: { preferredBy: Array<string>; dislikedBy: Array<string> }
}

// TODO: add date, verifiedAt, and unverifiedBy attributes
export type ScheduledShift = {
  id: string
  shiftID: string
  date: string
  assignedUser: string
  status: string
  options: string
  verifiedBy: string
  verifiedAt: string
  unverifiedAt: string
  penaltyHours: number
  shiftCopy: Shift
}

export type House = {
  id: string
  name: string
  houseID: string
  categories: Record<string, string[]>
  address: string
  schedule: Record<string, string[]>
  userPINs: Record<string, string>
  preferences: {
    [key: string]: {
      preferredBy: Array<string>
      dislikedBy: Array<string>
      isActive: boolean
    }
  }
}

// export enum Days {
//   Mon = 'Monday',
//   mon = 'monday',
//   Tue = 'Tuesday',
//   tue = 'tuesday',
//   Wed = 'Wednesday',
//   wed = 'wednesday',
//   Thu = 'Thursday',
//   thu = 'thursday',
//   Fri = 'Friday',
//   fri = 'friday',
//   Sat = 'Saturday',
//   sat = 'saturday',
//   Sun = 'Sunday',
//   sun = 'sunday',
// }

export type Days =
  | 'All'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type RowOfCSV = {
  // TODO: add application number so that we can use this as the unique id for the authorizedUsers
  email: string
  firstName: string
  lastName: string
  houseID: string
  accountCreated: boolean
}

export type userPreferences = 'prefer' | 'dislike' | null

export type ShiftPreferences = {
  [key: string]: {
    newPreference: string | null
    savedPreference: string | null
    hasChanged: boolean
  }
}
