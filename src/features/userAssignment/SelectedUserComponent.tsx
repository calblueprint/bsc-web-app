import { Stack, Typography } from '@mui/material'
import { Box, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
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
    <Stack direction="row" sx={{ marginBottom: '1%', marginLeft: 3 }}>
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
    // <Box
    //   display={'flex'}
    //   bgcolor={'#D1FAE5'}
    //   component={Paper}
    //   alignItems="center"
    //   sx={{ flexGrow: 1, marginBottom: 2, minHeight: '50px' }}
    // >
    //   <Box>
    //     {user && selectedUserId ? (
    //       <Typography variant="h6" marginLeft={3}>
    //         {user.displayName}
    //       </Typography>
    //     ) : (
    //       <Typography variant="h6" marginLeft={3}>
    //         No selected user
    //       </Typography>
    //     )}
    //   </Box>
    //   <Box sx={{ marginLeft: 'auto' }}>
    //     {selectedUserId ? (
    //       <CloseButton handleClick={handleUnselectedUserId} />
    //     ) : null}
    //   </Box>
    // </Box>
  )
}
export default SelectedUserComponent
