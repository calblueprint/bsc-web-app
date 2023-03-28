import { Shift } from '@/types/schema'
import { Dictionary, EntityId, EntityState } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import SortedTable from '@/components/shared/tables/SortedTable'
import { HeadCell } from '@/interfaces/interfaces'

const shiftHeadCells: HeadCell<Shift & { [key in keyof Shift]: string | number }>[] = [
    {
        id: 'name',
        isNumeric: false,
        label: 'Shift Name',
        isSortable: true,
        align: 'left',
    },
    {
        id: 'timeWindowDisplay',
        isNumeric: true,
        label: 'Time',
        isSortable: false,
        align: 'left',
    },
    {
        id: 'hours',
        isNumeric: true,
        label: 'Value',
        isSortable: true,
        align: 'left',
    },
]
// const dayFilter = [
//     'all',
//     'monday',
//     'tuesday',
//     'wednesday',
//     'thursday',
//     'friday',
//     'saturday',
//     'sunday',
// ]

const UnassignedShiftsTable = ({
    shiftIds,
    shiftEntities,
}: {
    shiftIds: EntityId[]
    shiftEntities: Dictionary<Shift>
}) => {
    const [filteredShiftIds, setFilteredShiftIds] = useState<EntityId[]>([])

    const handleRowClick = (event: React.MouseEvent<unknown, MouseEvent>, entityId: EntityId) => {
        console.log(entityId)
    }

    useEffect(() => {
        console.log('changed ids in unassigned table')
        if (shiftEntities && shiftIds) {
            const newIds = shiftIds.filter((id: EntityId) => {
                const user = shiftEntities[id]?.assignedUser
                // console.log(user)
                if (!user || user === '') {
                    return id
                }
            })
            // console.log(newIds)
            setFilteredShiftIds(newIds)
        }
    }, [shiftEntities, shiftIds])

    return (
        <SortedTable
            ids={filteredShiftIds}
            entities={shiftEntities as Shift & { [key in keyof Shift]: string | number }}
            headCells={shiftHeadCells}
            isCheckable={false}
            isSortable={true}
            handleRowClick={handleRowClick}
        />
    )
}

export default UnassignedShiftsTable
