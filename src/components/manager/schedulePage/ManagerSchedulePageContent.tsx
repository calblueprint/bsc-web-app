import { selectManagerNavState } from "@/features/user/usersSlice";
import { useSelector } from "react-redux";
import ManagerAllShiftsTabContent from "./allShiftsTab/ManagerAllShiftsTabContent";
import ManagerIndividualTabContent from "./individualTab/ManagerIndividualTabContent";

const ManagerScheduleContent = () => {
  const managerNavState = useSelector(selectManagerNavState);
  let content = null;
  if (managerNavState.tab === 0) {
    content = <ManagerAllShiftsTabContent />;
  } else if (managerNavState.tab === 1) {
    content = <ManagerIndividualTabContent />;
  } else {
    content = <h1>Error</h1>;
  }
  return content;
};
export default ManagerScheduleContent;
