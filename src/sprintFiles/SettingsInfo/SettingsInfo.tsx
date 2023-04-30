import { Button, Card, CardContent, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
// import { updateUser } from '../../../firebase/queries/user'
import { generatePinNumber } from '../helpers'
import { User, House } from '@/types/schema'
import styles from './SettingsInfo.module.css'
import { lightButton } from '@/assets/StyleGuide'
// import { useSelector } from 'react-redux'
import EditUserCard from '@/features/user/cards/EditUserCard'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useUpdateUserMutation } from '@/features/user/userApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

// type SettingsInfoProps = {
//   userID: string
// }

const SettingsInfo = () => {
  /**
   * Returns a card component to display a member's personal information in the settings page
   *
   * @param userID - ID of the member
   */
  // const [user, setUser] = useState<User | null>()
  // const [house, setHouse] = useState<House | null>()
  const user = useSelector(selectCurrentUser) as User

  const [editing, setEditing] = useState<boolean>(false)
  const [editType, setEditType] = useState<string | undefined>()

  // const [name, setName] = useState<string | null>()
  // const [email, setEmail] = useState<string | null>()
  const [pin, setPin] = useState<number | null>(user.pinNumber)
  const star = '*'
  console.log('current user pin', user.pinNumber, user)
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()

  const [EstablishContext, {}] = useEstablishContextMutation()

  const handleOpenName = () => {
    setEditType('Name')
    setEditing(true)
  }

  const handleOpenEmail = () => {
    setEditType('Email')
    setEditing(true)
  }

  const handleOpenPassword = () => {
    setEditType('Password')
    setEditing(true)
  }

  const ResetPin = async () => {
    const newPin = generatePinNumber(5)
    setPin(newPin)
    const data = {
      data: {},
      houseId: user ? user.houseID : 'EUC',
      userId: user ? user.id : '',
    }
    data.data = { pinNumber: newPin }
    await updateUser(data)
    EstablishContext(user.id)
  }

  return user && user.houseID ? (
    <div className={styles.content}>
      <EditUserCard
        userId={user.id}
        open={editing}
        setOpen={setEditing}
        editType={editType}
      />
      <Card>
        <CardContent className={styles.card}>
          <div className={styles.body}>
            <Typography className={styles.bodyTitle} variant="h6">
              Name
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {user.displayName}
              </Typography>
              <div className={styles.edit}>
                <Button sx={lightButton} onClick={handleOpenName}>
                  Edit
                </Button>
              </div>
            </div>

            <Typography className={styles.bodyTitle} variant="h6">
              Email
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {user.email}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={handleOpenEmail} sx={lightButton}>
                  Edit
                </Button>
              </div>
            </div>

            <Typography className={styles.bodyTitle} variant="h6">
              Password
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {star.repeat(10)}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={handleOpenPassword} sx={lightButton}>
                  Edit
                </Button>
              </div>
            </div>
            <Typography className={styles.bodyTitle} variant="h6">
              Pin Code
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {pin}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={ResetPin} sx={lightButton}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div></div>
  )
}

export default SettingsInfo
