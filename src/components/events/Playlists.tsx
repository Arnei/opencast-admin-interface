;import TablePage from "../shared/TablePage";
import {
  fetchPlaylists,
  Playlist as PlaylistRow,
 } from "../../slices/playlistSlice";
import { loadPlaylistsIntoTable } from "../../thunks/tableThunks";
import { getTotalPlaylists } from "../../selectors/playlistSelectors";
import { eventsLinks } from "./partials/EventsNavigation";
import { playlistsTemplateMap } from "../../configs/tableConfigs/playlistsTableMap";
import PlaylistDetailsModal from "./partials/modals/PlaylistDetailsModal";
import { useAppDispatch } from "../../store";
import { fetchAclDefaults } from "../../slices/aclSlice";
import { Row } from "../../slices/tableSlice";


/**
 * This component renders the table view of playlists
 */
const Playlists = () => {
  const dispatch = useAppDispatch();

  const onNewPlaylistModal = async () => {
    await dispatch(fetchAclDefaults());
  };

  return <>
    <TablePage<Row & PlaylistRow>
      resource={"playlists"}
      fetchResource={fetchPlaylists}
      loadResourceIntoTable={loadPlaylistsIntoTable}
      getTotalResources={getTotalPlaylists}
      navBarLinks={eventsLinks}
      navBarCreate={{
        accessRole: "ROLE_UI_PLAYLISTS_CREATE",
        onShowModal: onNewPlaylistModal,
        text: "EVENTS.EVENTS.ADD_PLAYLIST",
        resource: "playlists",
      }}
      caption={"EVENTS.PLAYLISTS.TABLE.CAPTION"}
      templateMap={playlistsTemplateMap}
    />

    <PlaylistDetailsModal />
  </>;
};

export default Playlists;
