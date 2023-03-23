//** React Hooks */
import React, { useEffect, useState } from "react";

//** Materials UI Components */
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

//** Material UI Icon */
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import SettingsIcon from "@mui/icons-material/Settings";

//** Hooks */
import { useSelector, useDispatch } from "react-redux";

//** React Redux */
import { selectCurrentRole } from "../../../features/auth/authSlice";
import {
  setMemberNavState,
  selectMemberNavState,
  setManagerNavState,
  selectManagerNavState,
  setSupervisorNavState,
  selectSupervisorNavState,
} from "../../../features/user/usersSlice";

//** Constant Variables */
import {
  memberCategories,
  managerCategories,
  supervisorCategories,
} from "./../constants";

//** Interfaces */
import { useRouter } from "next/router";

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

// const icons = {
//     Dashboard: <DashboardCustomizeRoundedIcon />,
//     Schedule: <CalendarMonthRoundedIcon />,
//     Planner: <CalendarMonthRoundedIcon />,
//     Profile: <SettingsIcon />,
//     Marketplace: <StorefrontRoundedIcon />,
// }

const getIcon = (iconName: string): React.ReactElement | null => {
  switch (iconName) {
    case "Dashboard":
      return <DashboardCustomizeRoundedIcon />;
    case "Schedule":
    case "Planner":
      return <CalendarMonthRoundedIcon />;
    case "Profile":
      return <SettingsIcon />;
    case "Marketplace":
      return <StorefrontRoundedIcon />;
    default:
      return null;
  }
};

// interface MemberCategory {
//     id: string
//     children: MemberCategoryChild[]
// }

interface MemberCategoryChild {
  id: string;
  path: string;
  active: number;
  icon: React.ReactElement;
}

/**
 * @des Displays and responds to user interaction for the navegation
 * @param props
 * @returns
 */
const NavButtons = () => {
  //** These are navStates variables from redux  */
  const memberNavState = useSelector(selectMemberNavState);
  const managerNavState = useSelector(selectManagerNavState);
  const supervisorNavState = useSelector(selectSupervisorNavState);
  const currentRole = useSelector(selectCurrentRole);

  //** Action dispatcher from redux */
  const dispatch = useDispatch();

  //** Nextjs router */
  const router = useRouter();

  //** holds the active button for the navbar */
  const [activeButton, setActiveButton] = useState(memberNavState.active);
  //** Holds the current active category  */
  const [categories, setCategories] = useState(memberCategories);

  //** This are the categories for the nav buttons each role has */
  const chooseCategory = {
    member: memberCategories,
    manager: managerCategories,
    supervisor: supervisorCategories,
  };

  //** These are the setter function tha set the state of the navbar */
  const chooseSetNavFunction = {
    member: setMemberNavState,
    manager: setManagerNavState,
    supervisor: setSupervisorNavState,
  };

  //** These are the states for each role */
  const chooseNavState = {
    member: memberNavState,
    manager: managerNavState,
    supervisor: supervisorNavState,
  };

  //** This fuction hadles the click of the navbar buttons */
  const handleClick = (id: string) => {
    categories.forEach((category) => {
      category.children.forEach((btn) => {
        if (btn.id === id) {
          // console.log('[NavButtons]: currentRole: ', currentRole)
          dispatch(
            chooseSetNavFunction[
              currentRole as keyof typeof chooseSetNavFunction
            ]({
              ...chooseNavState[currentRole as keyof typeof chooseNavState],
              id: btn.id,
              active: btn.active,
              path: btn.path,
              tab: 0,
            })
          );
          setActiveButton(btn.active);
          // router.push(btn.path)
        }
      });
    });
  };

  useEffect(() => {
    if (currentRole) {
      // console.log('[NavButtons]: currentRole: ', currentRole)
      const state = chooseNavState[currentRole as keyof typeof chooseNavState];
      setCategories(chooseCategory[currentRole as keyof typeof chooseCategory]);
      setActiveButton(state.active);
      router.push(state.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  // useEffect(() => {
  //     console.log('Mounting NavButtons')
  //     return () => {
  //         console.log('Unmounting NavButtons')
  //     }
  // }, [])
  //TODO: Delete after testing ********************************

  let buttons = categories?.map(({ id, children }) => (
    <Box key={id} sx={{ bgcolor: "#101F33" }}>
      <ListItem sx={{ py: 2, px: 3 }}>
        <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
      </ListItem>
      {children.map(({ id: childId, active }) => {
        const isActive = active === activeButton ? true : false;
        return (
          <ListItem disablePadding key={childId}>
            <ListItemButton
              selected={isActive}
              sx={item}
              onClick={() => handleClick(childId)}
            >
              <ListItemIcon>{getIcon(childId)}</ListItemIcon>
              <ListItemText>{childId}</ListItemText>
            </ListItemButton>
          </ListItem>
        );
      })}
      <Divider sx={{ mt: 2 }} />
    </Box>
  ));
  return <React.Fragment>{buttons}</React.Fragment>;
};
export default NavButtons;
