import { TableConfig } from "../configs/tableConfigs/aclsTableConfig";
import {
	deselectAll,
	loadResourceIntoTable,
	selectAll,
	selectRow,
	setOffset,
	setPageActive,
	setPages,
} from "../slices/tableSlice";
import {
	setEventColumns,
	setShowActions as showEventsActions,
	fetchEvents,
} from "../slices/eventSlice";
import {
	getPageOffset,
	getResourceType,
	getSelectedRows,
	getTablePages,
	getTablePagination,
} from "../selectors/tableSelectors";
import {
	fetchSeries,
	setSeriesColumns,
	showActionsSeries,
} from "../slices/seriesSlice";
import { fetchJobs, setJobColumns } from "../slices/jobSlice";
import { fetchServers, setServerColumns } from "../slices/serverSlice";
import { fetchServices, setServiceColumns } from "../slices/serviceSlice";
import { fetchUsers, setUserColumns } from "../slices/userSlice";
import { fetchGroups } from "../slices/groupSlice";
import { fetchThemes, setThemeColumns } from "../slices/themeSlice";
import { fetchRecordings, setRecordingsColumns } from "../slices/recordingSlice";
import { setGroupColumns } from "../slices/groupSlice";
import { fetchAcls, setAclColumns } from "../slices/aclSlice";
import { AppDispatch, AppThunk, RootState } from "../store";
import { GenericAsyncThunk } from "../utils/utils";
import { Resource } from "../slices/tableSlice";

/**
 * This file contains methods/thunks used to manage the table in the main view and its state changes
 * */

// Tracks the in-flight fetch (if any) per resource type, keyed by identity of
// the dispatched thunk action so staleness can be checked without a separate
// counter. Lives outside Redux since it is pure request-lifecycle bookkeeping,
// not application state, and needs to be reachable from every call site that
// can trigger a reload for a resource (auto-refresh, pagination, filters,
// filter profiles) rather than just the component that happens to dispatch it.
const inFlightRequests = new Map<Resource, { abort:() => void }>();

/**
 * Single entry point for fetching a resource and loading it into the table.
 * Coordinates with any other in-flight fetch for the same resource:
 * - `auto` (unattended, e.g. the polling interval) yields if a fetch is
 *   already running, instead of piling up requests.
 * - Anything else (user-initiated: filters, pagination, mount) always runs,
 *   cancelling whatever was in flight so its response can no longer land
 *   after this one and clobber it.
 */
export const loadResourcePage = (
	resource: Resource,
	fetchResource: GenericAsyncThunk,
	loadResourceIntoTable: () => AppThunk,
	opts: { auto?: boolean } = {},
): AppThunk<Promise<void>> => async dispatch => {
	const existing = inFlightRequests.get(resource);

	if (opts.auto && existing) {
		return;
	}
	existing?.abort();

	const action = dispatch(fetchResource());
	inFlightRequests.set(resource, action);

	const result = await action;

	if (inFlightRequests.get(resource) === action) {
		inFlightRequests.delete(resource);
	}

	if (result.meta.requestStatus === "fulfilled") {
		dispatch(loadResourceIntoTable());
	}
};

// Cancels the in-flight fetch for a resource, if any. Used when a component
// that owns a resource's polling unmounts, so a response that arrives after
// unmount can't dispatch stale data into what is now a different resource.
export const cancelResourceFetch = (resource: Resource) => {
	inFlightRequests.get(resource)?.abort();
};

// Method to load events into the table
export const loadEventsIntoTable = (): AppThunk => (dispatch, getState) => {
	const { events, table } = getState();
	const total = events.total;
	const pagination = table.pagination;
	let isNewEventAdded = false;
	// check which events are currently selected
	const resource = events.results.map(result => {
		const current = table.rows.entities[result.id];

		if (!!current && table.resource === "events") {
			return {
				...result,
				selected: current.selected,
			};
		} else {
			isNewEventAdded = true;
			return {
				...result,
				selected: false,
			};
		}
	});

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "events" as const,
		rows: resource,
		columns: events.columns,
		multiSelect: table.multiSelect["events"],
		pages: pages,
		sortBy: table.sortBy["events"],
		reverse: table.reverse["events"],
		totalItems: total,
		isNewEventAdded: isNewEventAdded,
		flags: {
    	isNewEventAdded,
  		},
	};
	dispatch(loadResourceIntoTable(tableData));
};

// Method to load series into the table
export const loadSeriesIntoTable = (): AppThunk => (dispatch, getState) => {
	const { series, table } = getState();
	const total = series.total;
	const pagination = table.pagination;
	// check which events are currently selected
	const resource = series.results.map(result => {
		const current = table.rows.entities[result.id];

		if (!!current && table.resource === "series") {
			return {
				...result,
				selected: current.selected,
			};
		} else {
			return {
				...result,
				selected: false,
			};
		}
	});

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "series" as const,
		rows: resource,
		columns: series.columns,
		multiSelect: table.multiSelect["series"],
		pages: pages,
		sortBy: table.sortBy["series"],
		reverse: table.reverse["series"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadRecordingsIntoTable = (): AppThunk => (dispatch, getState) => {
	const { recordings, table } = getState();
	const pagination = table.pagination;
	const resource = recordings.results;
	const total = recordings.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "recordings" as const,
		columns: recordings.columns,
		multiSelect: table.multiSelect["recordings"],
		pages: pages,
		sortBy: table.sortBy["recordings"],
		reverse: table.reverse["recordings"],
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadJobsIntoTable = (): AppThunk => (dispatch, getState) => {
	const { jobs, table } = getState();
	const pagination = table.pagination;
	const resource = jobs.results;
	const total = jobs.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "jobs" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: jobs.columns,
		multiSelect: table.multiSelect["jobs"],
		pages: pages,
		sortBy: table.sortBy["jobs"],
		reverse: table.reverse["jobs"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadServersIntoTable = (): AppThunk => (dispatch, getState) => {
	const { servers, table } = getState();
	const pagination = table.pagination;
	const resource = servers.results;
	const total = servers.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "servers" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: servers.columns,
		multiSelect: table.multiSelect["servers"],
		pages: pages,
		sortBy: table.sortBy["servers"],
		reverse: table.reverse["servers"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadServicesIntoTable = (): AppThunk => (dispatch, getState) => {
	const { services, table } = getState();
	const pagination = table.pagination;
	const resource = services.results;
	const total = services.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		pages: pages,
		totalItems: total,
		resource: "services" as const,
		columns: services.columns,
		multiSelect: table.multiSelect["services"],
		sortBy: table.sortBy["services"],
		reverse: table.reverse["services"],
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadUsersIntoTable = (): AppThunk => (dispatch, getState) => {
	const { users, table } = getState();
	const pagination = table.pagination;
	const resource = users.results;
	const total = users.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "users" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: users.columns,
		multiSelect: table.multiSelect["users"],
		pages: pages,
		sortBy: table.sortBy["users"],
		reverse: table.reverse["users"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadGroupsIntoTable = (): AppThunk => (dispatch, getState) => {
	const { groups, table } = getState();
	const pagination = table.pagination;
	const resource = groups.results;
	const total = groups.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "groups" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: groups.columns,
		multiSelect: table.multiSelect["groups"],
		pages: pages,
		sortBy: table.sortBy["groups"],
		reverse: table.reverse["groups"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadAclsIntoTable = (): AppThunk => (dispatch, getState) => {
	const { acls, table } = getState();
	const pagination = table.pagination;
	const resource = acls.results;
	const total = acls.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "acls" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: acls.columns,
		multiSelect: table.multiSelect["acls"],
		pages: pages,
		sortBy: table.sortBy["acls"],
		reverse: table.reverse["acls"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

export const loadThemesIntoTable = (): AppThunk => (dispatch, getState) => {
	const { themes, table } = getState();
	const pagination = table.pagination;
	const resource = themes.results;
	const total = themes.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	const tableData = {
		resource: "themes" as const,
		rows: resource.map(obj => {
			return { ...obj, selected: false };
		}),
		columns: themes.columns,
		multiSelect: table.multiSelect["themes"],
		pages: pages,
		sortBy: table.sortBy["themes"],
		reverse: table.reverse["themes"],
		totalItems: total,
	};

	dispatch(loadResourceIntoTable(tableData));
};

// Resolves the fetch/load-into-table pair for the table's current resource
// type. Shared by every thunk below that needs to (re)load the current page.
const currentResourceLoader = (state: RootState): {
	resource: Resource,
	fetchResource: GenericAsyncThunk,
	loadResourceIntoTable: () => AppThunk,
} => {
	const resource = getResourceType(state);
	switch (resource) {
		case "events":
			return { resource, fetchResource: fetchEvents, loadResourceIntoTable: loadEventsIntoTable };
		case "series":
			return { resource, fetchResource: fetchSeries, loadResourceIntoTable: loadSeriesIntoTable };
		case "recordings":
			return { resource, fetchResource: fetchRecordings as GenericAsyncThunk, loadResourceIntoTable: loadRecordingsIntoTable };
		case "jobs":
			return { resource, fetchResource: fetchJobs, loadResourceIntoTable: loadJobsIntoTable };
		case "servers":
			return { resource, fetchResource: fetchServers, loadResourceIntoTable: loadServersIntoTable };
		case "services":
			return { resource, fetchResource: fetchServices, loadResourceIntoTable: loadServicesIntoTable };
		case "users":
			return { resource, fetchResource: fetchUsers, loadResourceIntoTable: loadUsersIntoTable };
		case "groups":
			return { resource, fetchResource: fetchGroups, loadResourceIntoTable: loadGroupsIntoTable };
		case "acls":
			return { resource, fetchResource: fetchAcls, loadResourceIntoTable: loadAclsIntoTable };
		case "themes":
			return { resource, fetchResource: fetchThemes, loadResourceIntoTable: loadThemesIntoTable };
	}
};

// Navigate between pages. This is also the one place all filter-driven
// reloads (applying/removing a filter, picking a filter profile) go through:
// they reset to page one and call this, instead of each separately
// re-triggering their own fetch, which used to fire two requests per change.
export const goToPage = (pageNumber: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
	dispatch(deselectAll());
	dispatch(setOffset(pageNumber));

	const state = getState();
	const offset = getPageOffset(state);
	const pages = getTablePages(state);

	if (pages) {
		dispatch(setPageActive(offset ? pages[offset].number : pageNumber));
	}

	const { resource, fetchResource, loadResourceIntoTable } = currentResourceLoader(getState());
	await dispatch(loadResourcePage(resource, fetchResource, loadResourceIntoTable));
};

// Update pages for example if page size was changed
export const updatePages = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
	const state = getState();

	const pagination = getTablePagination(state);

	const pages = calculatePages(
		pagination.totalItems / pagination.limit,
		pagination.offset,
	);

	dispatch(setPages(pages));

	const { resource, fetchResource, loadResourceIntoTable } = currentResourceLoader(getState());
	await dispatch(loadResourcePage(resource, fetchResource, loadResourceIntoTable));
};

// Select all rows on table page
export const changeAllSelected = (selected: boolean): AppThunk => (dispatch, getState) => {
	const state = getState();

	if (selected) {
		switch (getResourceType(state)) {
			case "events": {
				dispatch(showEventsActions(true));
				break;
			}
			case "series": {
				dispatch(showActionsSeries(true));
				break;
			}
		}
		dispatch(selectAll());
	} else {
		switch (getResourceType(state)) {
			case "events": {
				dispatch(showEventsActions(false));
				break;
			}
			case "series": {
				dispatch(showActionsSeries(false));
				break;
			}
		}
		dispatch(deselectAll());
	}
};

// Select certain columns
export const changeColumnSelection = (updatedColumns: TableConfig["columns"]) => async (
	dispatch: AppDispatch, getState: () => RootState,
) => {
	const state = getState();

	switch (getResourceType(state)) {
		case "events": {
			dispatch(setEventColumns(updatedColumns));

			if (getSelectedRows(state).length > 0) {
				dispatch(showEventsActions(true));
			} else {
				dispatch(showEventsActions(false));
			}

			dispatch(loadEventsIntoTable());

			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());

			break;
		}
		case "series": {
			dispatch(setSeriesColumns(updatedColumns));

			if (getSelectedRows(state).length > 0) {
				dispatch(showActionsSeries(true));
			} else {
				dispatch(showActionsSeries(false));
			}

			dispatch(loadSeriesIntoTable());
			break;
		}
		case "recordings": {
			dispatch(setRecordingsColumns(updatedColumns));
			dispatch(loadRecordingsIntoTable());
			break;
		}
		case "jobs": {
			dispatch(setJobColumns(updatedColumns));
			dispatch(loadJobsIntoTable());
			break;
		}
		case "servers": {
			dispatch(setServerColumns(updatedColumns));
			dispatch(loadServersIntoTable());
			break;
		}
		case "services": {
			dispatch(setServiceColumns(updatedColumns));
			dispatch(loadServicesIntoTable());
			break;
		}
		case "users": {
			dispatch(setUserColumns(updatedColumns));
			dispatch(loadUsersIntoTable());
			break;
		}
		case "groups": {
			dispatch(setGroupColumns(updatedColumns));
			dispatch(loadGroupsIntoTable());
			break;
		}
		case "acls": {
			dispatch(setAclColumns(updatedColumns));
			dispatch(loadAclsIntoTable());
			break;
		}
		case "themes": {
			dispatch(setThemeColumns(updatedColumns));
			dispatch(loadThemesIntoTable());
			break;
		}
	}
};

// Select certain row
export const changeRowSelection = (id: string): AppThunk => (dispatch, getState) => {
	dispatch(selectRow(id));

	const state = getState();

	switch (getResourceType(state)) {
		case "events": {
			if (getSelectedRows(state).length > 0) {
				dispatch(showEventsActions(true));
			} else {
				dispatch(showEventsActions(false));
			}
			break;
		}
		case "series": {
			if (getSelectedRows(state).length > 0) {
				dispatch(showActionsSeries(true));
			} else {
				dispatch(showActionsSeries(false));
			}
			break;
		}
	}
};

const calculatePages = (numberOfPages: number, offset: number) => {
	const pages = [];

	for (let i = 0; i < numberOfPages || (i === 0 && numberOfPages === 0); i++) {
		pages.push({
			number: i,
			label: (i + 1).toString(),
			active: i === offset,
		});
	}

  if (pages.every(page => page.active === false)) {
    pages[0].active = true;
  }

	return pages;
};
