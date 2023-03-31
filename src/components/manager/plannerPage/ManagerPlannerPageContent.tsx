import { selectManagerNavState } from "@/features/user/usersSlice";
import { useSelector } from "react-redux";
import ManagerAssignedTabContent from "./assignedTab/ManagerAssignedTabContent";
import ManagerCategoriesTabContent from "./categoriesTab/ManagerCategoriesTabContent";
import ManagerUnassignedTabContent from "./unassignedTab/ManagerUnassignedTabContent";

const ManagerPlannerContent = () => {
  const managerNavState = useSelector(selectManagerNavState);
  let content = null;
  if (managerNavState.tab === 0) {
    content = <ManagerUnassignedTabContent />;
  } else if (managerNavState.tab === 1) {
    content = <ManagerAssignedTabContent />;
  } else if (managerNavState.tab === 2) {
    content = <ManagerCategoriesTabContent />;
  } else {
    content = <h1>Error</h1>;
  }
  return content;
};
export default ManagerPlannerContent;
