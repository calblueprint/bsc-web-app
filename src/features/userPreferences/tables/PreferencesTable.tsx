import * as React from 'react'
import Box from '@mui/material/Box'
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
import { House, Shift, User } from '@/types/schema'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { Dictionary } from '@reduxjs/toolkit'

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
]

export default function PreferencesTable() {
  const authUser = useSelector(selectCurrentUser) as User
  const authHouse = useSelector(selectCurrentHouse) as House
  const { data: AllShifts, isLoading } = useGetShiftsQuery(authHouse.id)

  const [houseCategories, setHouseCategories] = useState<
    { [key: string]: Array<string> } | undefined
  >(undefined)

  useEffect(() => {
    if (AllShifts) {
      const categories: { [key: string]: Array<string> } | undefined = {}
      const ids = AllShifts.ids
      const entities = AllShifts.entities
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
      console.log(categories)
      setHouseCategories({ ...categories })
    }
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
  return <React.Fragment>{table}</React.Fragment>
}
