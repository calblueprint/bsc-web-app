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
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import { House, Shift } from '@/types/schema'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useEffect } from 'react'
import { useUpdateShiftMutation } from '@/features/shift/shiftApiSlice'
import { Snackbar, Alert } from '@mui/material'
import { validatePreferences } from '@/utils/utils'

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
  const authHouse = useSelector(selectCurrentHouse) as House
  const { shiftsIds, category, shiftEntities } = props
  const [open, setOpen] = React.useState(false)
  const [authUserId, setAuthUserId] = React.useState('')
  const [alignment, setAlignment] = React.useState<string | null>(null)
  const [isEditing, setIsEditing] = React.useState(true)
  const [mainPreference, setMainPreference] = React.useState<
    'No Preference' | 'Mix Preference' | 'Prefere All' | 'Dislike All'
  >('No Preference')

  const [shiftPreferences, setShiftPreference] = React.useState<{
    [key: string]: {
      newPreference: string | null
      savedPreference: string | null
      hasChanged: boolean
    }
  }>()

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    console.log(newAlignment)
    const shiftPreferencesCopy = JSON.parse(JSON.stringify(shiftPreferences))

    console.log(shiftPreferencesCopy)
    if (shiftPreferences) {
      shiftsIds.map((shiftId) => {
        if (shiftPreferencesCopy[shiftId].savedPreference === newAlignment) {
          shiftPreferencesCopy[shiftId].hasChanged = false
        } else {
          shiftPreferencesCopy[shiftId].hasChanged = true
        }
        shiftPreferencesCopy[shiftId].newPreference = newAlignment
      })
    }
    console.log(shiftPreferencesCopy)

    setShiftPreference(shiftPreferencesCopy)

    setAlignment(newAlignment)
  }

  const handleSingleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
    id: string
  ) => {}

  //** if true it opens the Succes message window */
  const [openSuccessMsg, setOpenSuccessMsg] = React.useState(false)
  //** if true it opens the Error message window */
  const [openErrorMsg, setOpenErrorMsg] = React.useState(false)

  //** Handles closing both success and error windows. */
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccessMsg(false)
    setOpenErrorMsg(false)
  }

  useEffect(() => {
    if (authUser) {
      setAuthUserId(authUser.id as string)
    }
  }, [authUser])

  useEffect(() => {
    if (shiftPreferences) {
      const arr = Object.values(shiftPreferences).map(
        (obj) => obj.newPreference
      )
      if (arr.every((value) => value === null)) {
        setMainPreference('No Preference')
        setAlignment(null)
      } else if (arr.every((value) => value === 'prefere')) {
        setMainPreference('Prefere All')
        setAlignment('prefere')
      } else if (arr.every((value) => value === 'dislike')) {
        setMainPreference('Dislike All')
        setAlignment('dislike')
      } else {
        setMainPreference('Mix Preference')
        setAlignment(null)
      }
      console.log('updated Main Preference')
    }
  }, [shiftPreferences])

  useEffect(() => {
    if (shiftsIds) {
      let obj = {}
      const getPreference = shiftsIds.map((shiftId) => {
        const preferences = validatePreferences(
          shiftEntities[shiftId]?.preferences as Shift['preferences']
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

      setShiftPreference(obj)
    }
  }, [shiftsIds, authUserId, shiftEntities])

  const content = (
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
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {category}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {isEditing ? (
          <Box
            display={'flex'}
            paddingTop={1}
            paddingBottom={1}
            marginRight={2}
          >
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={(event, value) => handleChange(event, value)}
              aria-label="Platform"
            >
              <ToggleButton value="prefere">Prefere All</ToggleButton>
              <ToggleButton value="dislike">Dislike All</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        ) : (
          <Box
            display={'flex'}
            paddingTop={2}
            // paddingBottom={1}
            marginRight={3}
          >
            <Typography variant="h6">{mainPreference}</Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <Table aria-label="shifts" sx={{ margin: '0' }}>
            <TableBody>
              {shiftPreferences
                ? Object.keys(shiftPreferences).map((id) => {
                    const { newPreference, hasChanged } = shiftPreferences[id]
                    return (
                      <TableRow key={id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {shiftEntities[id]?.name}
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 0, margin: 0 }}>
                          <ToggleButtonGroup
                            color="primary"
                            size="small"
                            value={newPreference}
                            sx={{ marginRight: 2 }}
                            exclusive
                            onChange={(event, value) =>
                              handleSingleChange(event, value, id)
                            }
                            aria-label="Platform"
                          >
                            <ToggleButton value="prefere">Prefere</ToggleButton>
                            <ToggleButton value="dislike">Dislike</ToggleButton>
                          </ToggleButtonGroup>
                        </TableCell>
                      </TableRow>
                    )
                  })
                : null}
              {/* {shiftsIds.map((id) => {
                const isValidShift = shiftEntities[id] ? true : false
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
                } else {
                  console.log('Newtral Shift')
                }
                return isValidShift ? (
                  <TableRow key={id}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {shiftEntities[id]?.name}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 0, margin: 0 }}>
                      <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={preferenceValue}
                        sx={{ marginRight: 2 }}
                        exclusive
                        onChange={(event, value) =>
                          handleSingleChange(event, value, id)
                        }
                        aria-label="Platform"
                      >
                        <ToggleButton value="prefere">Prefere</ToggleButton>
                        <ToggleButton value="dislike">Dislike</ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                ) : null
              })} */}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
      <Snackbar
        open={openSuccessMsg}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          All Preferences updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorMsg}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Could not save preferences!
        </Alert>
      </Snackbar>
    </React.Fragment>
  )

  const display = <React.Fragment></React.Fragment>

  return content
}
