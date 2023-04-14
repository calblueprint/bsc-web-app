import { ActionMsgBox } from '@/sprintFiles/ActionMsgBox/ActionMsgBox'
import { Button } from '@mui/material'
import React from 'react'

const ManagerAvailabilityTabContent = () => {
  const [open, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(true)
  }
 

  return (
    <div>
      <Button onClick={handleClick}>Test Button (can delete)</Button>
      <ActionMsgBox
        messageTop="Big Message"
        messageBottom="Small Message"
        iconType="CheckCircleIcon"
        setOpen={setOpen}
        open={open}
      />
    </div>
  )
}
export default ManagerAvailabilityTabContent
