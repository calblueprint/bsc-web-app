import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsEditingPreferences,
  selectUserShiftPreferences,
  setIsEditingPreferences,
  setIsUpdatingPreferences,
  setShiftPreferences,
} from '../userShiftPreferencesSlice'
import {
  useGetShiftsQuery,
  useUpdateShiftMutation,
} from '@/features/shift/shiftApiSlice'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { House, Shift } from '@/types/schema'
import { validatePreferences } from '@/utils/utils'
import { Snackbar, Alert } from '@mui/material'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

interface EditButtonsProps {
  isEditing: boolean
  handleCancel: () => void
  handleSave: () => Promise<void>
  handleEdit: () => void
}

/**
 *
 * @param isEditing set to true when user can change preferences
 * @param handleCancel handles clicking the cancel button
 * @param handleSave handles clicking the save button
 * @param handleEdit handles clicking the edit button
 *
 * @returns returns buttun elements for preference
 */
const EditButtons: React.FC<EditButtonsProps> = ({
  isEditing,
  handleCancel,
  handleSave,
  handleEdit,
}) => (
  <Box display={'flex'} flexDirection={'row'}>
    <Box sx={{ flexGrow: 1 }} />
    {isEditing ? (
      <>
        <Box sx={{ marginBottom: 2, marginRight: 2 }}>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </Box>
      </>
    ) : (
      <Box sx={{ marginBottom: 2 }} alignSelf={'right'}>
        <Button onClick={handleEdit} variant="contained">
          Edit Preferences
        </Button>
      </Box>
    )}
  </Box>
)

/**
 * @description Hold the button preference as well as the button logic
 * @returns Returns and button group component
 */
export default function PreferencesButtons() {
  //** Get the editing state from redux */
  const isEditing = useSelector(selectIsEditingPreferences)
  //** Get authorized house from redux state */
  const authHouse = useSelector(selectCurrentHouse)
  //** Get authorized user form mredux state */
  const authUser = useSelector(selectCurrentUser)
  //** Get shift preferences from the redux state */
  const shiftPreferences = useSelector(selectUserShiftPreferences)
  //** dispatch hook for redux actions */
  const dispatch = useDispatch()

  //** opens and closes success message */
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false)
  //** opens and closes error message */
  const [openErrorMsg, setOpenErrorMsg] = useState(false)

  //** Update house mutation api to update house */
  const [updateHouses, { isLoading, isSuccess, isError }] =
    useUpdateHousesMutation()

  //** User context function to update current user house and user information */
  const [establishContext, {}] = useEstablishContextMutation()

  //**  Callback to handle edit button click */
  const handleEdit = () => {
    dispatch(setIsEditingPreferences({ isEditing: true }))
  }

  // Callback to handle cancel button click
  const handleCancel = () => {
    dispatch(setIsEditingPreferences({ isEditing: false }))
    dispatch(setShiftPreferences({ preferences: authHouse?.preferences }))
  }

  // Callback to handle save button click
  const handleSave = async () => {
    if (shiftPreferences) {
      // console.log('+++++Saving ShiftPreferences: ', shiftPreferences)
      await updateShiftPreferences()
      dispatch(setIsEditingPreferences({ isEditing: false }))
    }
  }

  //** Closes snackbar messages */
  const handleCloseMsg = () => {
    setOpenErrorMsg(false)
    setOpenSuccessMsg(false)
  }

  // Callback to update shift preferences
  const updateShiftPreferences = async () => {
    // Rest of the code remains unchanged
    dispatch(setIsUpdatingPreferences({ isUpdating: true }))
    if (!authHouse) {
      console.log(
        '[ERROR]: (updateShiftPreferences) -- authHouse is not defined'
      )
      return false
    }
    if (!authUser) {
      console.log(
        '[ERROR]: (updateShiftPreferences) -- authUser is not defined'
      )
      return false
    }

    try {
      const data = {
        data: { preferences: shiftPreferences },
        houseId: authHouse.id,
      }
      await updateHouses(data).unwrap()
      await establishContext(authUser.id).unwrap()
      setOpenSuccessMsg(true)
    } catch (error) {
      console.log(error)
      setOpenErrorMsg(true)
    } finally {
      dispatch(setIsUpdatingPreferences({ isUpdating: false }))
    }
  }

  return (
    <React.Fragment>
      <EditButtons
        isEditing={isEditing}
        handleCancel={handleCancel}
        handleSave={handleSave}
        handleEdit={handleEdit}
      />
      <Snackbar
        open={openSuccessMsg}
        autoHideDuration={6000}
        onClose={handleCloseMsg}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseMsg}
          severity="success"
          sx={{ width: '100%' }}
        >
          All Preferences updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorMsg}
        autoHideDuration={6000}
        onClose={handleCloseMsg}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseMsg} severity="error" sx={{ width: '100%' }}>
          Could not save preferences!
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}
