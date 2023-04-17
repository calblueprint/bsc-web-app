import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectUserById, useGetUsersQuery } from '../features/user/userApiSlice'
import { RootState } from '@/store/store'
import { User } from '@/types/schema'
import CloseButton from './CloseButton'

const DisplayAssignedUser = ({ userId }: { userId?: EntityId }) => {
  const user: User = useSelector(
    (state: RootState) => selectUserById(state, userId as EntityId) as User
  )

  if (user) {
    return <Typography>{user?.firstName}</Typography>
  } else {
    return <Typography>No assigned user</Typography>
  }
}

const SelectedUserComponent = ({
  userId,
  handleClick,
}: {
  userId?: EntityId
  handleClick: () => void
}) => {
  const {} = useGetUsersQuery({})
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container bgcolor={'#D1FAE5'}>
        <Grid xs={'auto'} md={'auto'} lg={'auto'}>
          <DisplayAssignedUser userId={userId} />
        </Grid>
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          {userId ? <CloseButton handleClick={handleClick} /> : null}
        </Grid>
      </Grid>
    </Box>
  )
}
export default SelectedUserComponent
