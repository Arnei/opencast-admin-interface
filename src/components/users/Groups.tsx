import { getTotalGroups } from "../../selectors/groupSelectors";
import { groupsTemplateMap } from "../../configs/tableConfigs/groupsTableMap";
import {
	loadGroupsIntoTable,
} from "../../thunks/tableThunks";
import { fetchGroups, Group } from "../../slices/groupSlice";
import { usersLinks } from "./partials/UsersNavigation";
import TablePage from "../shared/TablePage";
import { Row } from "../../slices/tableSlice";

/**
 * This component renders the table view of groups
 */
const Groups = () => {
	return (
		<TablePage<Row & Group>
			resource={"groups"}
			fetchResource={fetchGroups}
			loadResourceIntoTable={loadGroupsIntoTable}
			getTotalResources={getTotalGroups}
			navBarLinks={usersLinks}
			navBarCreate={{
				accessRole: "ROLE_UI_GROUPS_CREATE",
				text: "USERS.ACTIONS.ADD_GROUP",
				resource: "group",
			}}
			caption={"USERS.GROUPS.TABLE.CAPTION"}
			templateMap={groupsTemplateMap}
		/>
	);
};

export default Groups;
