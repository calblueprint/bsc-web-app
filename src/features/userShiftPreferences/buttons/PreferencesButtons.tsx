import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsEditingPreferences,
  selectResetPreferences,
  selectUserShiftPreferences,
  setIsEditingPreferences,
  setIsUpdatingPreferences,
  setResetPreferences,
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

// EditButtons component to display the buttons for editing preferences.
interface EditButtonsProps {
  isEditing: boolean
  handleCancel: () => void
  handleSave: () => Promise<void>
  handleEdit: () => void
}

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

export default function PreferencesButtons() {
  const authUser = useSelector(selectCurrentUser)
  const authHouse = useSelector(selectCurrentHouse)
  const shiftPreferences = useSelector(selectUserShiftPreferences)
  const isEditing = useSelector(selectIsEditingPreferences)
  const dispatch = useDispatch()
  const { data: allShifts } = useGetShiftsQuery(authHouse?.id as string)

  const [savingPreferences, setSavingPreferences] = useState(false)

  const [updateShift, { isLoading, isSuccess, isError }] =
    useUpdateShiftMutation()

  const [updatedShifts, setUpdatedShifts] = useState<{
    [key: string]: Shift['preferences']
  }>({})

  // Callback to handle edit button click
  const handleEdit = useCallback(() => {
    dispatch(setIsEditingPreferences({ isEditing: true }))
  }, [dispatch])

  // Callback to handle cancel button click
  const handleCancel = useCallback(() => {
    dispatch(setIsEditingPreferences({ isEditing: false }))
    // dispatch(setResetPreferences({ resetPreferences: true }))
    setUpdatedShifts({})
  }, [dispatch])

  // Callback to handle save button click
  const handleSave = useCallback(async () => {
    if (shiftPreferences) {
      console.log('+++++Saving ShiftPreferences: ', shiftPreferences)
      setSavingPreferences(true)
      await updateShiftPreferences()
      dispatch(setIsEditingPreferences({ isEditing: false }))
      setSavingPreferences(false)

      dispatch(setResetPreferences({ resetPreferences: true }))
    }
  }, [shiftPreferences])

  // Callback to update shift preferences
  const updateShiftPreferences = useCallback(async () => {
    // Rest of the code remains unchanged
    dispatch(setIsUpdatingPreferences({ isUpdating: true }))
    if (allShifts) {
      let updatedPreferences: {
        [key: string]: Shift['preferences']
      } = {}
      for (const category in shiftPreferences) {
        // console.log('______Category', category)
        for (const shiftId in shiftPreferences[category]) {
          const { hasChanged, newPreference, savedPreference } =
            shiftPreferences[category][shiftId]
          if (hasChanged) {
            //remove the old preference
            const oldPreferences = validatePreferences(
              allShifts.entities[shiftId]?.preferences as Shift['preferences']
            )

            if (savedPreference === 'prefere') {
              oldPreferences.preferredBy = oldPreferences.preferredBy.filter(
                (id) => id !== authUser?.id
              )
            } else if (savedPreference === 'dislike') {
              oldPreferences.dislikedBy = oldPreferences.dislikedBy.filter(
                (id) => id !== authUser?.id
              )
            }
            if (newPreference === 'prefere') {
              oldPreferences.preferredBy = [
                ...oldPreferences.preferredBy,
                authUser?.id as string,
              ]
            } else if (newPreference === 'dislike') {
              oldPreferences.dislikedBy = [
                ...oldPreferences.dislikedBy,
                authUser?.id as string,
              ]
            }
            updatedPreferences = {
              ...updatedPreferences,
              [shiftId]: oldPreferences,
            }
            setUpdatedShifts((prev) => ({
              ...prev,
              [shiftId]: oldPreferences,
            }))
          }
        }
      }

      console.log(
        '[in Save function]: updatedPrerefences:   ',
        updatedPreferences
      )
      try {
        for (const key in updatedPreferences) {
          const data = {
            data: { preferences: updatedPreferences[key] },
            houseId: authHouse?.id as string,
            shiftId: key,
          }
          const res = await updateShift(data)
          // console.log('firebase response: ', res)
        }
      } catch (error) {
        console.error(error)
      }

      // const newPreference = shiftPreferences[category][shiftId]
    }
  }, [allShifts, authHouse, authUser, shiftPreferences, updateShift])

  useEffect(() => {
    if (!savingPreferences && isSuccess) {
      dispatch(setIsUpdatingPreferences({ isUpdating: false }))
    }
  }, [savingPreferences])

  // Effect to log updated shifts
  useEffect(() => {
    if (updatedShifts) {
      console.log('updatedShifts:   ', updatedShifts)
    }
  }, [updatedShifts])

  useEffect(() => {
    if (updatedShifts) {
      console.log('updatedShifts:   ', updatedShifts)
    }
  }, [updatedShifts])

  useEffect(() => {
    if (isEditing) {
      console.log('isEditing is true')
    }
  }, [isEditing])

  return (
    <EditButtons
      isEditing={isEditing}
      handleCancel={handleCancel}
      handleSave={handleSave}
      handleEdit={handleEdit}
    />
  )
}
