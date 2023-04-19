import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import {
  House,
  Shift,
  ShiftPreferences,
  User,
  userPreferences,
} from '@/types/schema'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentHouse,
  selectCurrentUser,
} from '@/features/auth/authSlice'
import { useEffect, useState } from 'react'
import { useUpdateShiftMutation } from '@/features/shift/shiftApiSlice'
import { Snackbar, Alert } from '@mui/material'
import { validatePreferences } from '@/utils/utils'
import {
  selectCatogoryCollapseByCategory,
  selectIsEditingPreferences,
  selectShiftsByCategoryPreferences,
  selectUserShiftPreferences,
  setCategoryCollapse,
  setShiftPreferences,
} from '../userShiftPreferencesSlice'
import { RootState } from '@/store/store'

export default function PrefrencesItem(props: {
  category: string
  shiftsIds: Array<string>
  shiftEntities: Dictionary<Shift>
}) {
  //** Get component props */
  const { shiftsIds, category, shiftEntities } = props

  //** Get authorized user from redux */
  const authUser = useSelector(selectCurrentUser) as User
  //** Select preferences from the given category  */
  const categoryPreferences = useSelector((state: RootState) =>
    selectShiftsByCategoryPreferences(state, category)
  )
  //** Select booleans for the category Collaps */
  const catogoryCollapseOpen = useSelector((state: RootState) =>
    selectCatogoryCollapseByCategory(state, category)
  )
  //** Get the boolean for editing preferences */
  const isEditing = useSelector(selectIsEditingPreferences)
  //** This holds the state of whole category which is mix/preferAll/dislikeAll */
  const [categoryState, setCategoryState] = useState<string | null>(null)
  //** Holds the value for displaying for the category state */
  const [categoryDisplay, setCategoryDisplay] = useState<string>()
  //** Array of all the choises for the shifts in the category */
  const [choisesObj, setChoisesObj] = useState<{
    [key: string]: string | null
  }>({})
  //** opens and closes success message */
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false)
  //** opens and closes error message */
  const [openErrorMsg, setOpenErrorMsg] = useState(false)

  //** Dispatcher for redux actions */
  const dispatch = useDispatch()

  //** handles the change when all the shift in a category are changed at onece */
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newChoise: string
  ) => {
    // console.log(newChoise)
    if (!categoryPreferences) {
      console.error('ERROR: No user preferences')
      return
    }
    let shiftPreferencesCopy: House['preferences'] = { ...categoryPreferences }
    shiftsIds.forEach((id) => {
      const { preferredBy, dislikedBy, isActive } = setChoice(
        shiftPreferencesCopy[id],
        newChoise
      )
      shiftPreferencesCopy = {
        ...shiftPreferencesCopy,
        [id]: { preferredBy, dislikedBy, isActive },
      }
    })

    // console.log(shiftPreferencesCopy)

    dispatch(setShiftPreferences({ preferences: shiftPreferencesCopy }))

    const newChoises = { ...choisesObj }
    Object.keys(choisesObj).forEach((key) => {
      newChoises[key] = newChoise
    })

    setChoisesObj({ ...newChoises })

    setCategoryState(newChoise)
  }

  //** Handles the changing a single shift preference */
  const handleSingleChange = (
    event: React.MouseEvent<HTMLElement>,
    newChoice: string,
    shiftId: string
  ) => {
    if (choisesObj[shiftId] === newChoice) return
    dispatch(
      setShiftPreferences({
        preferences: {
          [shiftId]: setChoice(categoryPreferences[shiftId], newChoice),
        },
      })
    )
    setChoisesObj((prev) => ({ ...prev, [shiftId]: newChoice }))
  }

  const handleCloseMsg = () => {
    setOpenErrorMsg(false)
    setOpenSuccessMsg(false)
  }

  //** gets the preference from a shift preference object */
  const getChoice = (preference: {
    dislikedBy: Array<string>
    preferredBy: Array<string>
    isActive: boolean
  }) => {
    const dislikedBy = [...preference.dislikedBy]
    const preferredBy = [...preference.preferredBy]
    if (dislikedBy.indexOf(authUser.id) !== -1) return 'dislike'
    if (preferredBy.indexOf(authUser.id) !== -1) return 'prefer'
    return null
  }

  //** sets the object of a shift preference with the given preference */
  const setChoice = (
    preference: {
      dislikedBy: Array<string>
      preferredBy: Array<string>
      isActive: boolean
    },
    newChoise: string
  ) => {
    const dislikedBy = [...preference.dislikedBy]
    const preferredBy = [...preference.preferredBy]
    const isPreferred = preferredBy.indexOf(authUser.id)
    const isDisliked = dislikedBy.indexOf(authUser.id)
    if (newChoise === 'prefer') {
      if (isDisliked !== -1) {
        dislikedBy.splice(isDisliked, 1)
      }
      if (isPreferred === -1) {
        preferredBy.push(authUser.id)
      }
    } else if (newChoise === 'dislike') {
      if (isPreferred !== -1) {
        preferredBy.splice(isPreferred, 1)
      }
      if (isDisliked === -1) {
        dislikedBy.push(authUser.id)
      }
    } else if (newChoise === null) {
      if (isDisliked !== -1) {
        dislikedBy.splice(isDisliked, 1)
      }
      if (isPreferred !== -1) {
        preferredBy.splice(isPreferred, 1)
      }
    }
    return { dislikedBy, preferredBy, isActive: preference.isActive }
  }

  //** Updates Choises Object when isEditing changes  */
  useEffect(() => {
    // console.log('categoryPreferences:  ', categoryPreferences)
    if (categoryPreferences) {
      let choises = {}
      Object.keys(categoryPreferences).forEach((key) => {
        choises = { ...choises, [key]: getChoice(categoryPreferences[key]) }
      })
      setChoisesObj({ ...choises })
      // console.log('categoryChoises changed: ', choises)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  //** sets the Category collaps object in redux. is close to start */
  useEffect(() => {
    dispatch(setCategoryCollapse({ [category]: false }))
  }, [category, dispatch])

  //** Updates the categories display when the choises object changes */
  useEffect(() => {
    if (choisesObj) {
      const arr = Object.values(choisesObj)
      if (arr.every((value) => value === null)) {
        setCategoryDisplay('No Preference')
        setCategoryState(null)
      } else if (arr.every((value) => value === 'prefer')) {
        setCategoryDisplay('Prefer All')
        setCategoryState('prefer')
      } else if (arr.every((value) => value === 'dislike')) {
        setCategoryDisplay('Dislike All')
        setCategoryState('dislike')
      } else {
        setCategoryDisplay('Mix Preference')
        setCategoryState(null)
      }
      // console.log('updated Main Preference')
    }
  }, [choisesObj])

  const content = (
    <React.Fragment>
      <Box display={'flex'}>
        <Box display={'flex'} paddingTop={2} paddingBottom={1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>
              dispatch(
                setCategoryCollapse({
                  collapseOpen: { [category]: !catogoryCollapseOpen },
                })
              )
            }
          >
            {catogoryCollapseOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
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
              value={categoryState}
              exclusive
              onChange={(event, value) => handleChange(event, value)}
              aria-label="Platform"
            >
              <ToggleButton value="prefer">Prefer All</ToggleButton>
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
            <Typography variant="h6">{categoryDisplay}</Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <Collapse in={catogoryCollapseOpen} timeout="auto" unmountOnExit>
        <Box>
          <Table aria-label="shifts" sx={{ margin: '0' }}>
            <TableBody>
              {categoryPreferences &&
              Object.keys(categoryPreferences).length !== 0
                ? Object.keys(categoryPreferences).map((id) => {
                    const choice = getChoice(categoryPreferences[id])

                    const buttonGroup = (
                      <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={choice}
                        sx={{ marginRight: 2 }}
                        exclusive
                        onChange={(event, value) =>
                          handleSingleChange(event, value, id)
                        }
                        aria-label="Platform"
                      >
<<<<<<< HEAD
                        <ToggleButton value="prefer">Prefer</ToggleButton>
=======
                        <ToggleButton value="prefer">Prefere</ToggleButton>
>>>>>>> 3577670748f0e35cb1f46ed51e92231dba962ef3
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
                        {choice}
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
                        {choice}
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
                    if (choice === 'prefer') {
                      displayContent = prefereDisplay
                    } else if (choice === 'dislike') {
                      displayContent = dislikeDisplay
                    } else if (choice === null) {
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

  return content
}
