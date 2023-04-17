import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import PrefrencesItem from '../items/PreferencesItem'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import { useGetHouseQuery } from '@/features/house/houseApiSlice'
import {
  selectCurrentUser,
  selectCurrentHouse,
} from '@/features/auth/authSlice'
import { House, Shift, ShiftPreferences, User } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import Stack from '@mui/material/Stack'
import {
  selectIsEditingPreferences,
  selectIsUpdatingPreferences,
  selectResetPreferences,
  selectUserShiftPreferences,
  setResetPreferences,
  setShiftPreferences,
} from '../userShiftPreferencesSlice'
import { validatePreferences } from '@/utils/utils'
import PreferencesButtons from '../buttons/PreferencesButtons'

export default function PreferencesTable() {
  const authUser = useSelector(selectCurrentUser) as User
  const authHouse = useSelector(selectCurrentHouse) as House
  const isUpdating = useSelector(selectIsUpdatingPreferences)
  const { data: AllShifts, isLoading } = useGetShiftsQuery(authHouse.id)

  const [houseCategories, setHouseCategories] = useState<
    { [key: string]: Array<string> } | undefined
  >(undefined)

  const [authUserId, setAuthUserId] = React.useState('')

  const resetPreferences = useSelector(selectResetPreferences)
  const isEditing = useSelector(selectIsEditingPreferences)

  // const shiftCategoryPreferences = useSelector(selectUserPreferences)
  const dispatch = useDispatch()

  const createHouseCategories = (
    ids: EntityId[],
    entities: Dictionary<Shift>
  ) => {
    const categories: { [key: string]: Array<string> } | undefined = {}
    if (!ids.length || !entities) {
      return undefined
    }
    ids.forEach((id) => {
      const category = entities[id]?.category
      if (category) {
        if (category in categories) {
          categories[category as keyof typeof categories].push(id as string)
        } else {
          categories[category] = [id as string]
        }
      } else {
        if ('Uncategorized' in categories) {
          categories['Uncategorized'].push(id as string)
        } else {
          categories['Uncategorized'] = [id as string]
        }
      }
    })

    return categories
  }

  useEffect(() => {
    if (AllShifts) {
      const ids = AllShifts.ids
      const entities = AllShifts.entities
      const categories: { [key: string]: Array<string> } | undefined =
        createHouseCategories(AllShifts.ids, AllShifts.entities)
      setHouseCategories({ ...categories })
    }
  }, [AllShifts])

  useEffect(() => {
    if (AllShifts && resetPreferences && authUserId) {
      const ids = AllShifts.ids
      const entities = AllShifts.entities
      const categories: { [key: string]: Array<string> } | undefined =
        createHouseCategories(AllShifts.ids, AllShifts.entities)

      if (!categories) {
        console.error('No categories')
        return
      }
      Object.keys(categories).forEach((category) => {
        const shiftsIds = categories[category]
        if (shiftsIds) {
          let obj = {}
          shiftsIds.map((shiftId) => {
            const preferences = validatePreferences(
              entities[shiftId]?.preferences as Shift['preferences']
            )
            const isDislike = preferences.dislikedBy.includes(authUserId)
            const isPrefere = preferences.preferredBy.includes(authUserId)
            const choise = isPrefere ? 'prefere' : isDislike ? 'dislike' : null
            obj = {
              ...obj,
              [shiftId]: {
                savedPreference: choise,
                newPreference: choise,
                hasChanged: false,
              },
            }
          })
          const allPreferences = { ...obj }
          dispatch(setShiftPreferences({ allPreferences, category }))
          // console.log('Loaded shift preferences ->', allPreferences)
          // setShiftPreference(obj)
        }
      })

      console.log(categories)

      dispatch(setResetPreferences(false))
    }
  }, [AllShifts, authUserId, dispatch, resetPreferences])

  useEffect(() => {
    if (authUser) {
      setAuthUserId(authUser.id as string)
    }
  }, [authUser])

  const table = houseCategories
    ? Object.keys(houseCategories).map((category) => {
        return (
          <Box key={uuid()} marginBottom={2} component={Paper}>
            <PrefrencesItem
              shiftsIds={houseCategories[category]}
              category={category}
              shiftEntities={AllShifts?.entities as Dictionary<Shift>}
              isEditing={isEditing}
            />
          </Box>
        )
      })
    : null
  return (
    <React.Fragment>
      <PreferencesButtons />
      {isUpdating ? (
        <Box>
          <Typography variant="h2">Is Updating Preferences</Typography>
        </Box>
      ) : (
        table
      )}
    </React.Fragment>
  )
}
