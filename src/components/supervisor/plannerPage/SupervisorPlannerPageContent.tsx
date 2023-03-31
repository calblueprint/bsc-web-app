import { selectSupervisorNavState } from "@/features/user/usersSlice";
import { useSelector } from "react-redux";
import SupervisorAssignedTabContent from "./assignedTab/SupervisorAssignedTabContent";
import SupervisorCategoriesTabContent from "./categoriesTab/SupervisorCategoriesTabContent";
import SupervisorUnassignedTabContent from "./unassignedTab/SupervisorUnassignedTabContent";

const SupervisorPlannerContent = () => {
  const supervisorNavState = useSelector(selectSupervisorNavState);
  let content = null;
  if (supervisorNavState.tab === 0) {
    content = <SupervisorUnassignedTabContent />;
  } else if (supervisorNavState.tab === 1) {
    content = <SupervisorAssignedTabContent />;
  } else if (supervisorNavState.tab === 2) {
    content = <SupervisorCategoriesTabContent />;
  } else {
    content = <h1>Error</h1>;
  }
  return content;
};
export default SupervisorPlannerContent;
