import SortedTable from '@/components/shared/tables/SortedTable'
import { HeadCell } from '@/interfaces/interfaces'
import { Shift, User } from '@/types/schema'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'

const userHeadCells: HeadCell<
  User & { [key in keyof User]: string | number | string[] }
>[] = [
  {
    id: 'preferredName',
    isNumeric: false,
    label: 'Workshifter Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'hoursAssigned',
    isNumeric: true,
    label: 'Hours Needed',
    isSortable: true,
    align: 'left',
  },
]

// const preferenceHeadCell: HeadCell<
//   Shift & { [key in keyof Shift]: string | number }
// >[] = [
//   {
//     id: 'preferences',
//     isNumeric: false,
//     label: 'Preference',
//     isSortable: true,
//     align: 'left',
//   },
// ]

const AvailableUsersTable = ({
  userIds,
  userEntities,
}: {
  userIds: EntityId[]
  userEntities: Dictionary<User>
}) => {
  const [filteredUserIds, setFilteredUserIds] = useState<EntityId[]>([])

  const handleRowClick = (
    event: React.MouseEvent<unknown, MouseEvent>,
    entityId: EntityId
  ) => {
    console.log(entityId)
  }

  useEffect(() => {
    if (userEntities && userIds) {
      const newIds = userIds.filter((id: EntityId) => {
        // console.log(user)
        if (id) {
          return id
        }
      })
      // console.log(newIds)
      setFilteredUserIds(newIds)
    }
  }, [userEntities, userIds])

  return (
    <SortedTable
      ids={filteredUserIds}
      entities={userEntities as Dictionary<unknown>}
      headCells={userHeadCells}
      isCheckable={false}
      isSortable={true}
      handleRowClick={handleRowClick}
    />
  )
}

export default AvailableUsersTable
