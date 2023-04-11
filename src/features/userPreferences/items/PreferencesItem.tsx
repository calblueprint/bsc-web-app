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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Dictionary } from '@reduxjs/toolkit'
import { Shift } from '@/types/schema'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useEffect } from 'react'

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

export default function PrefrencesItem(props: {
  shiftsIds: Array<string>
  category: string
  shiftEntities: Dictionary<Shift>
}) {
  const authUser = useSelector(selectCurrentUser)
  const { shiftsIds, category, shiftEntities } = props
  const [open, setOpen] = React.useState(false)
  const [authUserId, setAuthUserId] = React.useState('')

  const [alignment, setAlignment] = React.useState<string | null>(null)

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
    id: string
  ) => {
    console.log(newAlignment)
    setAlignment(newAlignment)
  }

  useEffect(() => {
    if (authUser) {
      setAuthUserId(authUser.id as string)
    }
  }, [authUser])

  return (
    <React.Fragment>
      <Box display={'flex'}>
        <Box display={'flex'} paddingTop={2} paddingBottom={1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography variant="h6"> {category}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box display={'flex'} paddingTop={1} paddingBottom={1} marginRight={2}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={(event, value) => handleChange(event, value, 'all')}
            aria-label="Platform"
          >
            <ToggleButton value="prefere">Prefere</ToggleButton>
            <ToggleButton value="dislike">Dislike</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Divider />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <Table aria-label="shifts" sx={{ margin: '0' }}>
            <TableBody>
              {shiftsIds.map((id) => {
                const preferences = shiftEntities[id]?.preferences
                let preferenceValue = null
                if (
                  preferences &&
                  preferences.preferredBy &&
                  preferences.dislikedBy
                ) {
                  if (preferences.preferredBy.includes(authUserId)) {
                    preferenceValue = 'prefere'
                  } else if (preferences.dislikedBy.includes(authUserId)) {
                    preferenceValue = 'disliked'
                  }
                }
                return (
                  <TableRow key={id}>
                    <TableCell component="th" scope="row">
                      {shiftEntities[id]?.name}
                    </TableCell>
                    <TableCell align="right">
                      <ToggleButtonGroup
                        color="primary"
                        value={preferenceValue}
                        exclusive
                        onChange={(event, value) =>
                          handleChange(event, value, id)
                        }
                        aria-label="Platform"
                      >
                        <ToggleButton value="prefere">Prefere</ToggleButton>
                        <ToggleButton value="dislike">Dislike</ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </React.Fragment>
  )
}
