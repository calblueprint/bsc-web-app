import { ActionMsgBox } from '@/sprintFiles/ActionMsgBox/ActionMsgBox'

const ManagerAvailabilityTabContent = () => {
  return (
    <div>
      <ActionMsgBox
        messageButton="add member"
        messagePopUp="member added"
        type="error"
      />
    </div>
  )
}
export default ManagerAvailabilityTabContent
