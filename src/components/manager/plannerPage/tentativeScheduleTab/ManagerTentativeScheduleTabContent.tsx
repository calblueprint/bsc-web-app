import PublishBtn from '@/features/publishSchedule/buttons/PublishBtn'
import ScheduleTable from '@/features/tentativeSchedule/tables/ScheduleTable'
import React from 'react'

const ManagerTentativeScheduleTabContent = () => {
  return (
    <React.Fragment>
      <PublishBtn />
      <ScheduleTable />
    </React.Fragment>
  )
}

export default ManagerTentativeScheduleTabContent
