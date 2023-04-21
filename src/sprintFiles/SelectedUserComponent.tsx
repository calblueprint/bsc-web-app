import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { EntityId } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserById, useGetUsersQuery } from '../features/user/userApiSlice'
import { RootState } from '@/store/store'
import { User } from '@/types/schema'
import CloseButton from './CloseButton'
import { selectSelectedUserId } from './userAssignmentSlice'

const DisplaySelectedUser = ({ userId }: { userId?: EntityId }) => {
  const user: User = useSelector(
    (state: RootState) => selectUserById(state, userId as EntityId) as User
  )

  if (user) {
    return (
      <Typography>
        {user.preferredName ? user.preferredName : user.displayName}
      </Typography>
    )
  } else {
    return <Typography>No selected user</Typography>
  }
}

const SelectedUserComponent = ({
  handleClick,
}: {
  handleClick: () => void
}) => {
  const selectedUserId = useSelector(selectSelectedUserId)

  // const {} = useGetUsersQuery({})
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container bgcolor={'#D1FAE5'}>
        <Grid xs={'auto'} md={'auto'} lg={'auto'}>
          <DisplaySelectedUser userId={selectedUserId} />
        </Grid>
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          {selectedUserId ? <CloseButton handleClick={handleClick} /> : null}
        </Grid>
      </Grid>
    </Box>
  )
}
export default SelectedUserComponent
