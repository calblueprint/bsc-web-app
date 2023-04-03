import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { RootState } from '../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../store/slices/counterSlice'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useGetUsersQuery } from '../features/user/userApiSlice'
import SortedTable from '../components/shared/tables/SortedTable'
import { Shift } from '../types/schema'
import { HeadCell } from '../interfaces/interfaces'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import NewShiftCard from '@/features/shift/cards/NewShiftCard'
import EditShiftCard from '@/features/shift/cards/EditShiftCard'
import NewUserCard from '@/features/user/cards/NewUserCard'
import EditUserCard from '@/features/user/cards/EditUserCard'
import { User } from '../types/schema'
import { selectCurrentUser } from '../features/auth/authSlice'
import Loading from '@/components/shared/Loading'

const shiftHeadCells: HeadCell<
  Shift & { [key in keyof Shift]: string | number }
>[] = [
  {
    id: 'name',
    isNumeric: false,
    label: 'Shift Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'timeWindowDisplay',
    isNumeric: true,
    label: 'Time',
    isSortable: false,
    align: 'left',
  },
  {
    id: 'hours',
    isNumeric: true,
    label: 'Value',
    isSortable: true,
    align: 'left',
  },
]

const userHeadCells: HeadCell<
  User & { [key in keyof User]: string | number }
>[] = [
  {
    id: 'displayName',
    isNumeric: false,
    label: 'User Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'firstName',
    isNumeric: true,
    label: 'First Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'lastName',
    isNumeric: true,
    label: 'Last Name',
    isSortable: true,
    align: 'left',
  },
]

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const authUser = useSelector(selectCurrentUser) as User
  const { data, isLoading } = useGetShiftsQuery(authUser?.houseID)
  const dispatch = useDispatch()

  React.useEffect(() => {
    // console.log('isLoading =', isLoading)
    // console.log(data)
  }, [isLoading, data])

  if (isLoading) {
    return <Loading />
  } else {
    return (
      <>
        <Box>
          <Button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </Button>
          <Typography color="black">{count}</Typography>
          <Button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </Button>
        </Box>
      </>
    )
  }
}

const ShiftTesting = () => {
  const authUser = useSelector(selectCurrentUser) as User
  const {
    data: dataShifts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetShiftsQuery(authUser?.houseID)

  const [openCard, setOpenCard] = React.useState<boolean>(false)
  const [selectedShiftId, setSelectedShiftId] = React.useState<
    string | undefined
  >()

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    console.log('ShiftId: ', id)
    setSelectedShiftId(id)
    setOpenCard(true)
  }

  React.useEffect(() => {
    if (isSuccess) {
      // console.log('Shifts Entity: ', dataShifts)
    }
    if (isError) {
      console.log('Error: ', error)
    }
  }, [isSuccess, dataShifts, isError, error])

  React.useEffect(() => {
    if (selectedShiftId) {
      console.log('Selected Shift: ', selectedShiftId)
    }
  }, [selectedShiftId])

  let content = null
  if (isLoading) {
    content = <Loading />
  } else if (isError) {
    content = <React.Fragment>is Error...</React.Fragment>
  } else if (isSuccess) {
    content = (
      <React.Fragment>
        <NewShiftCard shiftId={selectedShiftId} />
        <SortedTable
          ids={dataShifts.ids as EntityId[]}
          entities={
            dataShifts?.entities as Dictionary<
              Shift & { [key in keyof Shift]: string | number }
            >
          }
          headCells={shiftHeadCells}
          isCheckable={false}
          isSortable={true}
          handleRowClick={handleClick}
        />
        <EditShiftCard
          shiftId={selectedShiftId}
          setOpen={setOpenCard}
          open={openCard}
        />
      </React.Fragment>
    )
  }
  return content
}

const UserTesting = () => {
  const {
    data: dataUsers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery({})

  const [openCard, setOpenCard] = React.useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = React.useState<
    string | undefined
  >()

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    console.log('UserId: ', id)
    setSelectedUserId(id)
    setOpenCard(true)
  }

  React.useEffect(() => {
    if (isSuccess) {
      console.log('Users Entity: ', dataUsers)
    }
    if (isError) {
      console.log('Error: ', error)
    }
  }, [isSuccess, dataUsers, isError, error])

  React.useEffect(() => {
    if (selectedUserId) {
      console.log('Selected User: ', selectedUserId)
    }
  }, [selectedUserId])

  let content = null
  if (isLoading) {
    content = <Loading />
  } else if (isError) {
    content = <React.Fragment>is Error...</React.Fragment>
  } else if (isSuccess) {
    content = (
      <React.Fragment>
        <NewUserCard userId={selectedUserId} />
        <SortedTable
          ids={dataUsers.ids as EntityId[]}
          entities={
            dataUsers?.entities as Dictionary<
              User & { [key in keyof User]: string | number }
            >
          }
          headCells={userHeadCells}
          isCheckable={false}
          isSortable={true}
          handleRowClick={handleClick}
        />
        <EditUserCard
          userId={selectedUserId}
          setOpen={setOpenCard}
          open={openCard}
        />
      </React.Fragment>
    )
  }
  return content
}

const ReduxTesting = () => {
  return (
    <React.Fragment>
      <Counter />

      <ShiftTesting />
      <UserTesting />
    </React.Fragment>
  )
}

export default ReduxTesting
