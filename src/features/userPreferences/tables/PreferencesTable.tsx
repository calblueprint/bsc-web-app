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
  selectUserPreferences,
  setShiftPreferences,
} from '../userPreferencesSlice'
import { validatePreferences } from '@/utils/utils'

export default function PreferencesTable() {
  const authUser = useSelector(selectCurrentUser) as User
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: AllShifts, isLoading } = useGetShiftsQuery(authHouse.id)
  const [isEditing, setIsEditing] = React.useState(false)

  const [houseCategories, setHouseCategories] = useState<
    { [key: string]: Array<string> } | undefined
  >(undefined)

  const [authUserId, setAuthUserId] = React.useState('')

  const shiftCategoryPreferences = useSelector(selectUserPreferences)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   if (AllShifts) {
  //     let categoriesPreferences: { [key: string]: ShiftPreferences } = {}
  //     const ids = AllShifts.ids
  //     const entities = AllShifts.entities
  //     let obj = {}
  //     ids.forEach((id) => {
  //       const category = entities[id]?.category
  //       const preferences = validatePreferences(
  //         entities[id]?.preferences as Shift['preferences']
  //       )
  //       const isDislike = preferences.dislikedBy.includes(authUserId)
  //       const isPrefere = preferences.preferredBy.includes(authUserId)
  //       const choise = isPrefere ? 'prefere' : isDislike ? 'dislike' : null
  //       obj = {
  //         ...obj,
  //         [id]: {
  //           savedPreference: choise,
  //           newPreference: choise,
  //           hasChanged: false,
  //         },
  //       }

  //       if (category) {
  //         if (category in categoriesPreferences) {
  //           let foundCategory = categoriesPreferences[category]
  //           let shiftPreferences = {
  //             [id]: {
  //               newPreference: entities[id]?.,
  //               savedPreference: '',
  //               hasChanged: false,
  //             },
  //           }
  //           categories[category as keyof typeof categories].push(id as string)
  //         } else {
  //           categories[category] = [id as string]
  //         }
  //       } else {
  //         if ('Uncategorized' in categories) {
  //           categories['Uncategorized'].push(id as string)
  //         } else {
  //           categories['Uncategorized'] = [id as string]
  //         }
  //       }
  //     })
  //     console.log(categories)
  //     setHouseCategories({ ...categories })
  //   }
  // }, [AllShifts])

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
      setHouseCategories({ ...categories })
    }
  }, [AllShifts])

  const handleEdit = () => {
    setIsEditing(true)
  }
  const handleCancel = () => {
    setIsEditing(false)
  }
  const handleSave = () => {
    // if (shiftCategoryPreferences) {
    //   for (const category in shiftCategoryPreferences) {
    //     console.log(category)
    //   }
    // }
  }

  const editButtons = (
    <Stack direction={'row'} alignItems={'end'}>
      <Box sx={{ flexGrow: 3 }} />
      {isEditing ? (
        <React.Fragment>
          <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </React.Fragment>
      ) : (
        <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
          <Button onClick={handleEdit} variant="contained">
            Edit Preferences
          </Button>
        </Box>
      )}
    </Stack>
  )

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
      {editButtons}
      {table}
    </React.Fragment>
  )
}
