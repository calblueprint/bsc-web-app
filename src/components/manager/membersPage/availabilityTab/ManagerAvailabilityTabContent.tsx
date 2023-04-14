import { ActionMsgBox } from '@/sprintFiles/ActionMsgBox/ActionMsgBox'

const ManagerAvailabilityTabContent = () => {
  return (
    <div>
      <ActionMsgBox
        messageButton="add member"
        messagePopUp="member added"
        iconType="navMembers"
      />
    </div>
  )
}
export default ManagerAvailabilityTabContent
