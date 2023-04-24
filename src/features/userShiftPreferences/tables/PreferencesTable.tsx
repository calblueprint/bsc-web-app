import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import PrefrencesItem from '../items/PreferencesItem'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'

import {
  selectCurrentUser,
  selectCurrentHouse,
} from '@/features/auth/authSlice'
import { House, Shift, ShiftPreferences, User } from '@/types/schema'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { Dictionary, EntityId } from '@reduxjs/toolkit'

import {
  selectIsUpdatingPreferences,
  setShiftPreferences,
  setShiftsByCategories,
} from '../userShiftPreferencesSlice'
import { validatePreferences } from '@/utils/utils'
import PreferencesButtons from '../buttons/PreferencesButtons'
import Loading from '@/components/shared/Loading'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

export default function PreferencesTable() {
  //** Get the current authorized user */
  const authUser = useSelector(selectCurrentUser) as User
  //** Get the authUser curren house */
  const authHouse = useSelector(selectCurrentHouse) as House
  //** Get the updating status of the house preferences */
  const isUpdating = useSelector(selectIsUpdatingPreferences)
  //** Query the house shifts */
  const {
    data: AllShifts,
    isLoading,
    isSuccess,
  } = useGetShiftsQuery(authHouse.id)
  //** Mutate current house */
  const [updateHouses, {}] = useUpdateHousesMutation()
  const [establishContext, {}] = useEstablishContextMutation()

  //** Boolean that is set to true when authHouse needs to be updated in the backEnd */
  const [updateAuthHousePreferences, setUpdateAuthHousePreferences] =
    useState(false)

  //** holds all the categories that exist */
  const [houseCategories, setHouseCategories] = useState<
    { [key: string]: Array<string> } | undefined
  >(undefined)

  //** redux action dispatcher */
  const dispatch = useDispatch()

  /**
   * @description Creates house categories given the ids and entities of all the shifts
   * @param ids holds the ids of all the shifts
   * @param entities holds the entities of all the shifts
   * @returns returns an map of of categories to array of shiftIds
   */
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

  //** Update the house preferences property to the backEnd */
  const updateHousePreference = async (preferences: House['preferences']) => {
    if (!preferences) {
      console.log('[updateHousePreference]:[ERROR] No preferences')
      return false
    }
    const data = { data: { preferences }, houseId: authHouse.id }
    try {
      await updateHouses(data).unwrap()
      await establishContext(authUser.id)
    } catch (error) {
      console.log('[updateHousePreference]: error: ' + error)
    }
  }

  //** Veryfy that all shifts are in the house preference property */
  useEffect(() => {
    if (AllShifts && authUser && authHouse) {
      let housePreferences: House['preferences'] = {}
      if (authHouse.preferences) {
        housePreferences = { ...authHouse.preferences }
      }
      let needsUpdate = false

      // this filteredIds are not in the house preference property
      let filteredIds = AllShifts.ids.filter(
        (id) => !housePreferences.hasOwnProperty(id)
      )

      // Check if house preferences has shifts that need to be deleted
      if (
        filteredIds.length + Object.keys(housePreferences).length !==
        AllShifts.ids.length
      ) {
        let idsToDelete = Object.keys(housePreferences).filter(
          (id) => !AllShifts.ids.includes(id)
        )
        idsToDelete.forEach((id) => {
          delete housePreferences[id]
        })
        needsUpdate = true
      }

      // Check if house preference needs to be updated
      if (filteredIds.length > 0) {
        needsUpdate = true
        filteredIds.forEach((id) => {
          housePreferences = {
            ...housePreferences,
            [id]: { preferredBy: [], dislikedBy: [], isActive: true },
          }
        })
      }

      if (needsUpdate) {
        // console.log('Updating house preference...')
        updateHousePreference(housePreferences)
      }
      dispatch(setShiftPreferences({ preferences: housePreferences }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, AllShifts, dispatch])

  //** Create house Categories and updates when AllShifts changes */
  useEffect(() => {
    if (AllShifts) {
      const ids = AllShifts.ids
      const entities = AllShifts.entities
      const categories: { [key: string]: Array<string> } | undefined =
        createHouseCategories(ids, entities)
      setHouseCategories({ ...categories })
      dispatch(setShiftsByCategories({ houseCategories: categories }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllShifts])

  const table = houseCategories
    ? Object.keys(houseCategories).map((category) => {
        return (
          <Box key={uuid()} marginBottom={2} component={Paper}>
            <PrefrencesItem
              shiftsIds={houseCategories[category]}
              category={category}
              shiftEntities={AllShifts?.entities as Dictionary<Shift>}
            />
          </Box>
        )
      })
    : null
  return (
    <React.Fragment>
      <PreferencesButtons />
      {isUpdating ? (
        <Box display={'flex'} flexDirection={'row'}>
          <Box>
            <Typography variant="h4">Updating Preferences...</Typography>
          </Box>
          <Box>
            <Loading />
          </Box>
        </Box>
      ) : (
        table
      )}
    </React.Fragment>
  )
}
