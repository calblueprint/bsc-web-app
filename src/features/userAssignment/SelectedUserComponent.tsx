import { Stack, Typography } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserById, useGetUsersQuery } from '../user/userApiSlice'
import { RootState } from '@/store/store'
import { User } from '@/types/schema'
import CloseButton from '@/components/shared/buttons/CloseButton'
import { selectSelectedUserId, setSelectedUserId } from './userAssignmentSlice'
import { shiftAssignInfo, shiftAssignTitle } from '@/assets/StyleGuide'

const SelectedUserComponent = () => {
  // TODO: figure out why we needed to query the users here and hopefully remove it?
  const { data: users } = useGetUsersQuery({})
  const selectedUserId = useSelector(selectSelectedUserId)
  const dispatch = useDispatch()

  const user: User = useSelector(
    (state: RootState) =>
      selectUserById(state, selectedUserId as EntityId) as User
  )

  const handleUnselectedUserId = () => {
    dispatch(setSelectedUserId({ selectedUserId: '' }))
  }

  return (
    <Stack direction="row" sx={{marginBottom: '1%'}}>
      {user && selectedUserId ? (
        <>
          <Typography sx={shiftAssignTitle}>Selected User: </Typography>
          <Typography sx={shiftAssignInfo}>{user.displayName}</Typography>
        </>
      ) : (
        <>
          <Typography sx={shiftAssignTitle}>Selected User: </Typography>
          <Typography sx={shiftAssignInfo}>None</Typography>
        </>
      )}
      {selectedUserId ? (
        <CloseButton handleClick={handleUnselectedUserId} />
      ) : null}
    </Stack>
  )
}
export default SelectedUserComponent
