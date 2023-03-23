import React, { useEffect } from "react";
import PrivateLayout from "../Layout";
import ReduxTesting from "@/pages/ReduxTesting";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentRole,
  selectCurrentUser,
  setCurrentRole,
} from "@/features/auth/authSlice";
import { selectManagerNavState } from "@/features/user/usersSlice";
import Loading from "@/components/shared/Loading";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import ManagerScheduleContent from "@/components/manager/schedule/ManagerScheduleContent";
import ManagerPlannerContent from "@/components/manager/planner/ManagerPlannerContent";
import ManagerMembersContent from "@/components/manager/members/ManagerMembersContent";

const ManagerAccount = () => {
  const authUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);
  const managerNavState = useSelector(selectManagerNavState);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      if (!authUser.roles?.includes("manager")) {
        console.log("No managers here *********");
        dispatch(setCurrentRole(""));
        router.replace("/");
      } else {
        if (!currentRole) {
          dispatch(setCurrentRole("manager"));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, currentRole]);

  let content = null;
  if (managerNavState.active === 0) {
    content = <ManagerScheduleContent />;
  } else if (managerNavState.active === 1) {
    content = <ManagerPlannerContent />;
  } else if (managerNavState.active === 2) {
    content = <ManagerMembersContent />;
  }

  return (
    <React.Fragment>
      {currentRole && authUser ? (
        <PrivateLayout>{content}</PrivateLayout>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

export default ManagerAccount;
