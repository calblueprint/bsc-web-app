import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CategoryShiftItem from '../items/CategoryShiftItem'
import CategoryItem from '../items/CategoryItem'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectHouseCategories,
  setHouseCategories,
  setHouseId,
  setIsCategoryOpen,
  setShiftCategories,
} from '../categoriesSlice'
import { useGetShiftsQuery } from '@/features/shift/shiftApiSlice'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { House, User } from '@/types/schema'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

const CategoriesTable = () => {
  const list = ['category', 'category2', 'category3', 'category4', 'category5']

  //** Get current authorized house from redux state */
  const authHouse = useSelector(selectCurrentHouse) as House
  //** Get curren authorized user from redux  */
  const authUser = useSelector(selectCurrentUser) as User
  //** Get house Categories */
  const houseCategories = useSelector(selectHouseCategories)

  //   const [houseCategories, setHouseCategories] = useState<Array<string>>([])

  //** Query the shifts from the database */
  const { data: shiftsData } = useGetShiftsQuery(authHouse.id)

  //** Get house update Api function from redux */
  const [updateHouses, {}] = useUpdateHousesMutation()
  //** get api to stablish conteex and update authUser and authHouse data */
  const [establishContext, {}] = useEstablishContextMutation()

  //** dispatch hook for dispatching action from redux */
  const dispatch = useDispatch()

  //** update House Categories */
  const updateHouseCategories = async (categories: House['categories']) => {
    let newCategories: House['categories'] = ['Uncategorized']
    if (categories) {
      newCategories = [...newCategories]
    }

    try {
      const data = {
        data: { categories: newCategories },
        houseId: authHouse.id,
      }
      await updateHouses(data)
      await establishContext(authUser.id)
    } catch (error) {
      console.log(error)
    }
  }

  //** Set House categories */
  useEffect(() => {
    if (authHouse) {
      if (!authHouse.categories || authHouse.categories.length === 0) {
        updateHouseCategories(['Uncategorized'])
      } else {
        dispatch(setHouseCategories({ houseCategories: authHouse.categories }))
        dispatch(setHouseId({ houseId: authHouse.id }))
      }
    }
  }, [authHouse])

  //** Create categories array and save it to redux */
  useEffect(() => {
    if (shiftsData && houseCategories && houseCategories.length) {
      const ids = shiftsData.ids
      const entities = shiftsData.entities

      let shiftsCategories: { [key: string]: Array<string> } = {}
      houseCategories.forEach((category) => {
        shiftsCategories = { ...shiftsCategories, [category]: [] }
      })
      ids.map((id) => {
        const shiftCategory = entities[id]?.category
        if (!shiftCategory) {
          //   console.log('Uncategorized ', shiftCategory)

          shiftsCategories['Uncategorized'].push(id as string)
        } else if (shiftsCategories.hasOwnProperty(shiftCategory)) {
          shiftsCategories[shiftCategory].push(id as string)
        } else {
          shiftsCategories = {
            ...shiftsCategories,
            [shiftCategory]: [id as string],
          }
        }
      })
      dispatch(setShiftCategories({ shiftCategories: shiftsCategories }))
    }
  }, [shiftsData, authHouse, dispatch])

  const table = (
    <React.Fragment>
      <Box>
        {houseCategories && houseCategories.length
          ? houseCategories.map((category, index) => (
              <CategoryItem key={index} category={category} />
            ))
          : null}
      </Box>
    </React.Fragment>
  )
  return table
}

export default CategoriesTable
