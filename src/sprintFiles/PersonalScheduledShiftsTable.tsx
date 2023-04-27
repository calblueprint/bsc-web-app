import SortedTable from '@/components/shared/tables/SortedTable'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { HeadCell } from '@/interfaces/interfaces'
import { House, ScheduledShift, Shift } from '@/types/schema'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const headCells: HeadCell<
  ScheduledShiftDisplayObject & {
    [key in keyof ScheduledShiftDisplayObject]: string
  }
>[] = [
  {
    id: 'shiftName',
    isNumeric: false,
    label: 'Shift Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'timeWindow',
    isNumeric: false,
    label: 'Time Window',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'creditHours',
    isNumeric: false,
    label: 'Credit Hours',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'status',
    isNumeric: false,
    label: 'Status',
    isSortable: true,
    align: 'left',
  },
]

type ScheduledShiftDisplayObject = {
  shiftName: string
  timeWindow: string
  creditHours: number
  status: string
}

const PersonalScheduledShiftsTable = ({
  scheduledShiftIds,
  scheduledShiftDictionary,
}: {
  scheduledShiftIds: EntityId[]
  scheduledShiftDictionary: Dictionary<ScheduledShift>
}) => {
  const [displayIDs, setDisplayIDs] = useState<EntityId[]>([])
  const [displayDictionary, setDisplayDictionary] =
    useState<Dictionary<ScheduledShiftDisplayObject>>()
  const currentHouse: House = useSelector(selectCurrentHouse) as House

  const { data: shifts } = useGetShiftsQuery(currentHouse.houseID)

  useEffect(() => {
    populateDisplayDictionary()
  }, [shifts, scheduledShiftIds])

  const populateDisplayDictionary = async () => {
    if (shifts === undefined) {
      return
    }
    console.log(scheduledShiftIds, 'schedshiftids')
    let copyDisplayIDs = []
    let copyDisplayDictionary: Dictionary<ScheduledShiftDisplayObject> = {}
    for (let i = 0; i < scheduledShiftIds.length; i++) {
      let scheduledShiftID = scheduledShiftIds[i]
      let scheduledShiftObject = scheduledShiftDictionary[scheduledShiftID]
      if (scheduledShiftObject === undefined) {
        continue
      }
      let shiftCopy: Shift | undefined = undefined
      if ('shiftCopy' in scheduledShiftObject) {
        shiftCopy = scheduledShiftObject['shiftCopy'] as Shift
      } else {
        let innerShiftID = scheduledShiftObject.shiftID
        shiftCopy = shifts.entities[innerShiftID] as Shift
      }
      if (shiftCopy === undefined) {
        continue
      }
      let newDisplayObject = {
        shiftName: shiftCopy.name,
        timeWindow: shiftCopy.timeWindowDisplay,
        creditHours: shiftCopy.hours,
        status: scheduledShiftObject.status,
      }
      copyDisplayIDs.push(scheduledShiftID)
      copyDisplayDictionary[scheduledShiftID] = newDisplayObject
    }
    setDisplayIDs(copyDisplayIDs)
    setDisplayDictionary(copyDisplayDictionary)
  }

  return (
    <SortedTable
      ids={displayIDs as EntityId[]}
      entities={
        displayDictionary as Dictionary<
          ScheduledShiftDisplayObject & {
            [key in keyof ScheduledShiftDisplayObject]: string
          }
        >
      }
      headCells={headCells}
      isCheckable={false}
      isSortable={true}
    />
  )
}

export default PersonalScheduledShiftsTable
