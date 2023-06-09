import SortedTable from '@/components/shared/tables/SortedTable'
import { selectCurrentHouse } from '@/features/auth/authSlice'
import { useGetScheduledShiftsQuery } from '@/features/scheduledShift/scheduledShiftApiSlice'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { HeadCell } from '@/interfaces/interfaces'
import { House, ScheduledShift, Shift } from '@/types/schema'
import { pluralizeHours } from '@/utils/utils'
import { Box } from '@mui/material'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const displayDateAndTime = (value: ScheduledShiftDisplayObject) => {
  const date = `${value.date} \n ${value.timeWindow}`
  return date
}

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
    id: 'category',
    isNumeric: false,
    label: 'Category',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'date',
    isNumeric: false,
    label: 'Date',
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
  category: string
  timeWindow: string
  creditHours: string
  status: string
  date: string
}

/**
 *
 * @param scheduledShiftIDs - The ids of the scheduled shifts to display
 * @param scheduledShiftDictionary - The dictionary of the scheduled shift id : scheduledShiftObject to display
 * @returns A table with all of the shifts based on the passed in IDs
 */
const AllScheduledShiftsTable = ({
  scheduledShiftIDs,
  scheduledShiftDictionary,
}: {
  scheduledShiftIDs: EntityId[]
  scheduledShiftDictionary: Dictionary<ScheduledShift>
}) => {
  // IDs that will be displayed
  const [displayIDs, setDisplayIDs] = useState<EntityId[]>([])
  // Dictionatry that will be passed into the Sorted Table
  const [displayDictionary, setDisplayDictionary] =
    useState<Dictionary<ScheduledShiftDisplayObject>>()
  const currentHouse: House = useSelector(selectCurrentHouse) as House

  const { data: shifts } = useGetShiftsQuery(currentHouse.houseID)

  useEffect(() => {
    populateDisplayDictionary()
  }, [shifts])

  useEffect(() => {
    populateDisplayDictionary()
  }, [scheduledShiftIDs]) // useEffect on parameter

  /**
   *
   * @returns Populates the display dictionary with display objects for the table
   */
  const populateDisplayDictionary = async () => {
    if (shifts === undefined) {
      return
    }
    // console.log(scheduledShiftIDs);
    let copyDisplayIDs = []
    let copyDisplayDictionary: Dictionary<ScheduledShiftDisplayObject> = {}
    for (let i = 0; i < scheduledShiftIDs.length; i++) {
      let scheduledShiftID = scheduledShiftIDs[i]
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
        category: shiftCopy.category,
        timeWindow: shiftCopy.timeWindowDisplay,
        date: scheduledShiftObject.date,
        creditHours: pluralizeHours(shiftCopy.hours),
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

export default AllScheduledShiftsTable
