import MemberMembersContent from "@/components/member/membersPage/MemberMembersPageContent";
import MemberScheduleContent from "@/components/member/schedulePage/MemberSchedulePageContent";
import MemberSettingsContent from "@/components/member/settingsPage/MemberSettingsPageContent";
import Loading from "@/components/shared/Loading";
import {
  selectCurrentRole,
  selectCurrentUser,
  setCurrentRole,
} from "@/features/auth/authSlice";
import { selectMemberNavState } from "@/features/user/usersSlice";
import { useRouter } from "next/router";
// import ReduxTesting from '@/pages/ReduxTesting'
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrivateLayout from "../Layout";

const MemberAccount = () => {
  const authUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const currentRole = useSelector(selectCurrentRole);
  const memberNavState = useSelector(selectMemberNavState);

  useEffect(() => {
    if (authUser) {
      if (!authUser.roles?.includes("supervisor")) {
        console.log("No supervisors here *********");
        dispatch(setCurrentRole(""));
        router.replace("/");
      } else {
        if (!currentRole) {
          dispatch(setCurrentRole("supervisor"));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, currentRole]);

  let content = null;
  if (memberNavState.active === 0) {
    content = <MemberScheduleContent />;
  } else if (memberNavState.active === 1) {
    content = <MemberMembersContent />;
  } else if (memberNavState.active === 2) {
    content = <MemberSettingsContent />;
  }

  return (
    <React.Fragment>
      {currentRole ? <PrivateLayout>{content}</PrivateLayout> : <Loading />}
    </React.Fragment>
  );
};

export default MemberAccount;
