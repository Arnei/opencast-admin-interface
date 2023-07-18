import axios from "axios";
import {
	loadServersFailure,
	loadServersInProgress,
	loadServersSuccess,
} from "../actions/serverActions";
import { getURLParams } from "../utils/resourceUtils";

// fetch servers from server
export const fetchServers = () => async (dispatch, getState) => {
	try {
		dispatch(loadServersInProgress());

		const state = getState();
		let params = getURLParams(state);

		// /servers.json?limit=0&offset=0&filter={filter}&sort={sort}
		let data = await axios.get("/admin-ng/server/servers.json", {
			params: params,
		});

		const servers = await data.data;

		console.info(servers);

		dispatch(loadServersSuccess(servers));
	} catch (e) {
		console.error(e);
		dispatch(loadServersFailure());
	}
};

// change maintenance status of a server/host
export const setServerMaintenance = async (host, maintenance) => {
	let data = new URLSearchParams();
	data.append("host", host);
	data.append("maintenance", maintenance);

	axios
		.post("/services/maintenance", data)
		.then((response) => {
			console.info(response);
		})
		.catch((response) => {
			console.error(response);
		});
};
