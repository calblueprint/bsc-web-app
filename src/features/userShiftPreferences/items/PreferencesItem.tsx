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
import { House, Shift, ShiftPreferences, userPreferences } from '@/types/schema'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useEffect } from 'react'
import { useUpdateShiftMutation } from '@/features/shift/shiftApiSlice'
import { Snackbar, Alert } from '@mui/material'
import { validatePreferences } from '@/utils/utils'
import {
  selectUserShiftPreferences,
  setShiftPreferences,
  setSingleShiftPreferences,
} from '../userShiftPreferencesSlice'

export default function PrefrencesItem(props: {
  shiftsIds: Array<string>
  category: string
  shiftEntities: Dictionary<Shift>
  isEditing: boolean
}) {
  const authUser = useSelector(selectCurrentUser)
  const authHouse = useSelector(selectCurrentHouse) as House
  const { shiftsIds, category, shiftEntities, isEditing } = props
  const [open, setOpen] = React.useState(false)
  const [authUserId, setAuthUserId] = React.useState('')
  const [alignment, setAlignment] = React.useState<string | null>(null)
  // const [isEditing, setIsEditing] = React.useState(false)
  const [mainPreference, setMainPreference] = React.useState<
    'No Preference' | 'Mix Preference' | 'Prefere All' | 'Dislike All'
  >('No Preference')

  // const [shiftPreferences, setShiftPreference] = React.useState<{
  //   [key: string]: {
  //     newPreference: string | null
  //     savedPreference: string | null
  //     hasChanged: boolean
  //   }
  // }>()

  const shiftPreferences: ShiftPreferences = useSelector(
    selectUserShiftPreferences
  )[category]

  const dispatch = useDispatch()

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    console.log(newAlignment)
    if (!shiftPreferences) {
      console.error('ERROR: No user preferences')
      return
    }
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

    dispatch(
      setShiftPreferences({ allPreferences: shiftPreferencesCopy, category })
    )

    // setShiftPreference(shiftPreferencesCopy)

    setAlignment(newAlignment)
  }

  const handleSingleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
    id: string
  ) => {
    console.log('id: ' + id, ' preference: ' + newAlignment)
    if (!shiftPreferences) {
      console.log('ERROR: No preference')
      return
    }

    console.log('id: ' + shiftPreferences[id].newPreference, ' preference')

    let { newPreference, savedPreference, hasChanged } = shiftPreferences[id]
    newPreference = newAlignment
    if (savedPreference === newAlignment) {
      hasChanged = false
    } else {
      hasChanged = true
    }

    const preference = { [id]: { savedPreference, newPreference, hasChanged } }

    dispatch(setSingleShiftPreferences({ preference, category }))

    // setShiftPreference({
    //   ...shiftPreferences,
    //   [id]: { savedPreference, newPreference, hasChanged },
    // })
  }

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
      // console.log('updated Main Preference')
    }
  }, [shiftPreferences])

  // useEffect(() => {
  //   if (shiftsIds) {
  //     let obj = {}
  //     const getPreference = shiftsIds.map((shiftId) => {
  //       const preferences = validatePreferences(
  //         shiftEntities[shiftId]?.preferences as Shift['preferences']
  //       )
  //       const isDislike = preferences.dislikedBy.includes(authUserId)
  //       const isPrefere = preferences.preferredBy.includes(authUserId)
  //       const choise = isPrefere ? 'prefere' : isDislike ? 'dislike' : null
  //       obj = {
  //         ...obj,
  //         [shiftId]: {
  //           savedPreference: choise,
  //           newPreference: choise,
  //           hasChanged: false,
  //         },
  //       }
  //     })
  //     const allPreferences = { ...obj }
  //     dispatch(setShiftPreferences({ allPreferences, category }))
  //     // console.log('Loaded shift preferences ->', allPreferences)
  //     // setShiftPreference(obj)
  //   }
  // }, [shiftsIds, authUserId, shiftEntities, dispatch, category])

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
              <ToggleButton value="prefere">Prefer All</ToggleButton>
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
              {shiftPreferences && Object.keys(shiftPreferences).length !== 0
                ? Object.keys(shiftPreferences).map((id) => {
                    // console.log('newPreference: ', shiftPreferences[id])
                    const { newPreference, hasChanged } = shiftPreferences[id]

                    const buttonGroup = (
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
                        <ToggleButton value="prefere">Prefer</ToggleButton>
                        <ToggleButton value="dislike">Dislike</ToggleButton>
                      </ToggleButtonGroup>
                    )

                    const prefereDisplay = (
                      <Typography
                        textTransform={'capitalize'}
                        marginRight={2}
                        sx={{
                          backgroundColor: 'green',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {'Prefere'}
                      </Typography>
                    )

                    const dislikeDisplay = (
                      <Typography
                        textTransform={'capitalize'}
                        marginRight={2}
                        sx={{
                          backgroundColor: 'red',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {'Dislike'}
                      </Typography>
                    )

                    const nullDisplay = (
                      <Typography
                        textTransform={'capitalize'}
                        marginRight={2}
                        sx={{
                          backgroundColor: 'gray',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {'No Preference'}
                      </Typography>
                    )
                    let displayContent = null
                    if (newPreference === 'prefere') {
                      displayContent = prefereDisplay
                    } else if (newPreference === 'dislike') {
                      displayContent = dislikeDisplay
                    } else if (newPreference === null) {
                      displayContent = nullDisplay
                    }

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
                          {isEditing ? buttonGroup : displayContent}
                        </TableCell>
                      </TableRow>
                    )
                  })
                : null}
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
