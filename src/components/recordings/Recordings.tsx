import { recordingsTemplateMap } from "../../configs/tableConfigs/recordingsTableMap";
import { getTotalRecordings } from "../../selectors/recordingSelectors";
import { loadRecordingsIntoTable } from "../../thunks/tableThunks";
import { fetchRecordings, Recording } from "../../slices/recordingSlice";
import TablePage from "../shared/TablePage";
import { GenericAsyncThunk } from "../../utils/utils";
import { Row } from "../../slices/tableSlice";

/**
 * This component renders the table view of recordings
 */
const Recordings = () => {
	return (
		<TablePage<Row & Recording>
			resource={"recordings"}
			fetchResource={fetchRecordings as GenericAsyncThunk}
			loadResourceIntoTable={loadRecordingsIntoTable}
			getTotalResources={getTotalRecordings}
			navBarLinks={[
				{
					path: "/recordings/recordings",
					accessRole: "ROLE_UI_LOCATIONS_VIEW",
					text: "RECORDINGS.NAVIGATION.LOCATIONS",
				},
			]}
			caption={"RECORDINGS.RECORDINGS.TABLE.CAPTION"}
			templateMap={recordingsTemplateMap}
		/>
	);
};

export default Recordings;
