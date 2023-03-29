import React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

type AvailabilitiesProps = {
    dayAvailability: { startTime: string; endTime: string }[]
}

const AvailabilityItem: React.FC<AvailabilitiesProps> = ({ dayAvailability }) => {
    console.log(dayAvailability)
    return (
        <TableRow>
            <TableCell>Item</TableCell>
        </TableRow>
    )
}

export default AvailabilityItem
