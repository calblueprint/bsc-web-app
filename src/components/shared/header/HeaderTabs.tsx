import React from 'react'

//** Materials UI Components */
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

//** Redux Slices */
import {
  setMemberNavState,
  selectMemberNavState,
  setManagerNavState,
  selectManagerNavState,
  setSupervisorNavState,
  selectSupervisorNavState,
  setTabValue,
} from '../../../features/user/usersSlice'

//** Hooks */
import { useSelector, useDispatch } from 'react-redux'

//** Custom hooks */
import useUserRolePath from '../../../hooks/useUserRolePath'

//** Constants */
import {
  memberTabs,
  managerTabs,
  supervisorTabs,
} from '../../../utils/constants'

//** Interfaces */
import { NavP } from '../../../interfaces/interfaces'

/**
 * @des Displays and interacts with user input to the tabs
 * @param navprops
 * @returns
 */
const HeaderTabs = () => {
  const memberNavState = useSelector(selectMemberNavState)
  const managerNavState = useSelector(selectManagerNavState)
  const supervisorNavState = useSelector(selectSupervisorNavState)
  const dispatch = useDispatch()

  const { isManagerPath, isMemberPath, isSupervisorPath } = useUserRolePath()

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number,
    userRole: number
  ) => {
    // console.log(newValue)
    switch (userRole) {
      case 0: // 0 is for member tabs
        // dispatch(setTabValue(newValue))
        dispatch(setMemberNavState({ ...memberNavState, tab: newValue }))
        break
      case 1: // 1 is for manager tabs
        // dispatch(setTabValue(newValue))
        dispatch(setManagerNavState({ ...managerNavState, tab: newValue }))
        break
      case 2: // 2 is for supervisor tabs
        // dispatch(setTabValue(newValue))
        dispatch(
          setSupervisorNavState({ ...supervisorNavState, tab: newValue })
        )
        break

      default:
        console.log('[HeaderTabs:handleOnchange]:Error selectin tab')
        break
    }
    dispatch(setTabValue(newValue))
  }
  return (
    <React.Fragment>
      {isMemberPath ? (
        <Tabs
          value={memberNavState.tab}
          onChange={(e, v) => handleChange(e, v, 0)}
          textColor="inherit"
        >
          {memberTabs[memberNavState.id as keyof typeof memberTabs].map(
            (tab) => (
              <Tab key={tab.id} label={tab.id} />
            )
          )}
        </Tabs>
      ) : null}
      {isManagerPath ? (
        <Tabs
          value={managerNavState.tab}
          onChange={(e, v) => handleChange(e, v, 1)}
          textColor="inherit"
        >
          {managerTabs[managerNavState.id as keyof typeof managerTabs].map(
            (tab) => (
              <Tab key={tab.id} label={tab.id} />
            )
          )}
        </Tabs>
      ) : null}
      {isSupervisorPath ? (
        <Tabs
          value={supervisorNavState.tab}
          onChange={(e, v) => handleChange(e, v, 2)}
          textColor="inherit"
        >
          {supervisorTabs[
            supervisorNavState.id as keyof typeof supervisorTabs
          ].map((tab) => (
            <Tab key={tab.id} label={tab.id} />
          ))}
        </Tabs>
      ) : null}
    </React.Fragment>
  )
}
export default HeaderTabs
