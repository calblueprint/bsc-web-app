import { ActionMsgBox } from '@/sprintFiles/ActionMsgBox/ActionMsgBox'
import { Button } from '@mui/material'
import React from 'react'
import AllMembersAvailabilityTable from '@/features/userAvailability/tabels/AllMembersAvailabilityTable'

const ManagerAvailabilityTabContent = () => {
  const [open, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(true)
  }

  return <AllMembersAvailabilityTable />
}
export default ManagerAvailabilityTabContent
