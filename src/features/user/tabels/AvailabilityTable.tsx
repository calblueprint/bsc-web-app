import { HeadCell } from '@/interfaces/interfaces'
import IconButton from '@mui/material/IconButton'
import React, { useEffect, useState } from 'react'
import Delete from '@mui/icons-material/Delete'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { Dictionary, EntityId } from '@reduxjs/toolkit'

const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type ButtonProps = {
    handleButtonClick?: (event: React.MouseEvent<unknown>, id: EntityId) => void
    id: EntityId
}
const DeleteButton = ({ handleButtonClick, id }: ButtonProps) => {
    return (
        <IconButton onClick={(event) => (handleButtonClick ? handleButtonClick(event, id) : null)}>
            <Delete />
        </IconButton>
    )
}

type MemberAvailability = { day: string; time: string; length: number; button: string }

const availabilityHeadCells: HeadCell<
    MemberAvailability & { [key in keyof MemberAvailability]: string | number }
>[] = [
    {
        id: 'day',
        isNumeric: false,
        label: 'Day',
        isSortable: true,
        align: 'left',
    },
    {
        id: 'time',
        isNumeric: false,
        label: 'Time',
        isSortable: false,
        align: 'right',
    },
    {
        id: 'length',
        isNumeric: true,
        label: 'Length',
        isSortable: true,
        align: 'right',
    },
    {
        id: 'button',
        isNumeric: true,
        label: '',
        isSortable: false,
        align: 'right',
        isButton: true,
        button: DeleteButton,
    },
]

const AvailabilityTable = () => {
    const authUser = useSelector(selectCurrentUser)
    const [ids, setIds] = useState<EntityId[]>([])
    const [entities, setEntities] = useState<Dictionary<MemberAvailability>>({})

    const handleDelete = () => {
        console.log('handleDelete')
    }

    useEffect(() => {
        if (authUser) {
            const newIds: EntityId[] = []
            let newEntities: Dictionary<MemberAvailability> = {}
            for (var i = 0; i < 10; i++) {
                newIds.push(i.toString())
                const avail: MemberAvailability = {
                    day: Days[i % 7],
                    time: '0' + i + '00',
                    length: i,
                    button: 'button',
                }
                newEntities[i.toString()] = avail
            }

            setIds(newIds)
            setEntities(newEntities)
        }
    }, [authUser])

    return (
        <SortedTable
            ids={ids}
            entities={entities}
            headCells={availabilityHeadCells}
            isCheckable={false}
            isSortable={true}
            handleButtonClick={handleDelete}
        />
    )
}

export default AvailabilityTable
