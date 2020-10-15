import {
    deselectAll,
    loadResourceIntoTable,
    selectAll,
    selectRow,
    setOffset,
    setPageActive, setPages
} from "../actions/tableActions";
import {showActions as showEventsActions} from "../actions/eventActions";
import {showActions as showSeriesActions} from "../actions/seriesActions";
import {
    getPageOffset,
    getResourceType,
    getSelectedRows,
    getTablePages,
    getTablePagination
} from "../selectors/tableSelectors";
import {eventsTableConfig}  from "../configs/tableConfigs/eventsTableConfig";
import {seriesTableConfig} from "../configs/tableConfigs/seriesTableConfig";
import {fetchEvents} from "./eventThunks";
import {fetchSeries} from "./seriesThunks";
import {recordingsTableConfig} from "../configs/tableConfigs/recordingsTableConfig";
import {fetchRecordings} from "./recordingThunks";
import {jobsTableConfig} from "../configs/tableConfigs/jobsTableConfig";
import {fetchJobs} from "./jobThunks";
import {serversTableConfig} from "../configs/tableConfigs/serversTableConfig";
import {fetchServers} from "./serverThunks";
import {fetchServices} from "./serviceThunks";
import {servicesTableConfig} from "../configs/tableConfigs/servicesTableConfig";

/**
 * This file contains methods/thunks used to manage the table in the main view and its state changes
 * */

// Method to load events into the table
export const loadEventsIntoTable = () => async (dispatch, getState) => {
    const { events } = getState();
    const pagination = getTablePagination(getState());
    const resource = events.results.map((result) => {
        return {
            ...result,
            selected: false
        }
    });

    const c = eventsTableConfig.columns;
    const columns = c.map(column => {
        const col = events.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated: col.deactivated
        }
    })
    const multiSelect = eventsTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "events",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "title"
    };
    dispatch(loadResourceIntoTable(tableData));

}

// Method to load series into the table
export const loadSeriesIntoTable = () => (dispatch, getState) => {
    const { series } = getState();
    const pagination = getTablePagination(getState());
    const resource = series.results.map((result) => {
        return {
            ...result,
            selected: false
        }
    });
    console.log('Load Series Results: ');
    console.log(resource);
    const c = seriesTableConfig.columns;
    const columns = c.map(column => {
        const col = series.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated: col.deactivated
        }
    });
    const multiSelect = seriesTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "series",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "title"
    };
    dispatch(loadResourceIntoTable(tableData));
};

export const loadRecordingsIntoTable = () => (dispatch, getState) => {
    const { recordings } = getState();
    const pagination = getTablePagination(getState());
    const resource = recordings.results;

    const c = recordingsTableConfig.columns;
    const columns = c.map(column => {
        const col = recordings.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated : col.deactivated
        }
    });

    const multiSelect = recordingsTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "recordings",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "status"
    };
    dispatch(loadResourceIntoTable(tableData));
}

export const loadJobsIntoTable = () => (dispatch, getState) => {
    const { jobs } = getState();
    const pagination = getTablePagination(getState());
    const resource = jobs.results;

    const c = jobsTableConfig.columns;
    const columns = c.map(column => {
        const col = jobs.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated: col.deactivated
        }
    });

    const multiSelect = jobsTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "jobs",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "id"
    };
    dispatch(loadResourceIntoTable(tableData));
}

export const loadServersIntoTable = () => (dispatch, getState) => {
    const { servers } = getState();
    const pagination = getTablePagination(getState());
    const resource = servers.results;

    const c = serversTableConfig.columns;
    const columns = c.map(column => {
        const col = servers.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated: col.deactivated
        }
    });

    const multiSelect = serversTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "servers",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "online"
    };
    dispatch(loadResourceIntoTable(tableData));

}

export const loadServicesIntoTable = () => (dispatch, getState) => {
    const { services } = getState();
    const pagination = getTablePagination(getState());
    const resource = services.results;

    const c = servicesTableConfig.columns;
    const columns = c.map(column => {
        const col = services.columns.find(co => co.name === column.name);
        return {
            ...column,
            deactivated: col.deactivated
        }
    });

    const multiSelect = servicesTableConfig.multiSelect;

    const pages = calculatePages(resource.length / pagination.limit, pagination.offset);

    const tableData = {
        resource: "services",
        rows: resource,
        columns: columns,
        multiSelect: multiSelect,
        pages: pages,
        sortBy: "status"
    };
    dispatch(loadResourceIntoTable(tableData));
}


// Navigate between pages
export const goToPage = pageNumber => (dispatch, getState) => {

    dispatch(deselectAll());
    dispatch(setOffset(pageNumber));

    const state = getState();
    const offset = getPageOffset(state);
    const pages = getTablePages(state);

    console.log(offset);
    console.log(pages[offset].number);

    dispatch(setPageActive(pages[offset].number));

    // Get resources of page and load them into table
    // todo: Check for all other type of resource
    // eslint-disable-next-line default-case
    switch (getResourceType(state)) {
        case 'events': {
            dispatch(fetchEvents());
            dispatch(loadEventsIntoTable());
            break;
        }
        case 'series': {
            dispatch(fetchSeries());
            dispatch(loadSeriesIntoTable());
            break;
        }
        case 'recordings': {
            dispatch(fetchRecordings());
            dispatch(loadRecordingsIntoTable());
            break;
        }
        case 'jobs': {
            dispatch(fetchJobs());
            dispatch(loadJobsIntoTable());
            break;
        }
        case 'servers': {
            dispatch(fetchServers());
            dispatch(loadServersIntoTable());
            break;
        }
        case 'services': {
            dispatch(fetchServices());
            dispatch(loadServicesIntoTable());
        }
    }
}

// Update pages for example if page size was changed
export const updatePages = () => (dispatch,getState) => {
    const state = getState();

    const pagination = getTablePagination(state);

    const pages = calculatePages(pagination.totalItems / pagination.limit, pagination.offset);

    dispatch(setPages(pages));

    // Get resources of page and load them into table
    // todo: Check for all other type of resource
    // eslint-disable-next-line default-case
    switch (getResourceType(state)) {
        case 'events': {
            dispatch(fetchEvents());
            dispatch(loadEventsIntoTable());
            break;
        }
        case 'series': {
            dispatch(fetchSeries());
            dispatch(loadSeriesIntoTable());
            break;
        }
        case 'recordings': {
            dispatch(fetchRecordings());
            dispatch(loadRecordingsIntoTable());
            break;
        }
        case 'jobs': {
            dispatch(fetchJobs());
            dispatch(loadJobsIntoTable());
            break;
        }
        case 'servers': {
            dispatch(fetchServers());
            dispatch(loadServersIntoTable());
            break;
        }
        case 'services': {
            dispatch(fetchServices());
            dispatch(loadServicesIntoTable());
        }
    }

}

// Select all rows on table page
export const changeAllSelected = selected => (dispatch, getState) => {
    const state = getState();

    if (selected) {
        // eslint-disable-next-line default-case
        switch (getResourceType(state)) {
            case 'events': {
                dispatch(showEventsActions(true));
                break;
            }
            case 'series': {
               dispatch(showSeriesActions(true));
               break;
            }
        }
        dispatch(selectAll());
    } else {
        // eslint-disable-next-line default-case
        switch (getResourceType(state)) {
            case 'events': {
                dispatch(showEventsActions(false));
                break;
            }
            case 'series': {
                dispatch(showSeriesActions(false));
                break;
            }
        }
        dispatch(deselectAll());
    }
}

// Select certain row
export const changeRowSelection = (id, selected) => (dispatch, getState) => {

    dispatch(selectRow(id, selected));

    const state = getState();

    // eslint-disable-next-line default-case
    switch (getResourceType(state)) {
        case 'events': {
            if (getSelectedRows(state).length > 0) {
                dispatch(showEventsActions(true));
            } else {
                dispatch(showEventsActions(false));
            }
            break;
        }
        case 'series': {
            if (getSelectedRows(state).length > 0) {
                dispatch(showSeriesActions(true));
            } else {
                dispatch(showSeriesActions(false));
            }
            break;
        }
    }
}

const calculatePages = (numberOfPages, offset) => {
    const pages = [];

    for (let i = 0; i < numberOfPages || (i === 0 && numberOfPages === 0); i++) {
        pages.push({
            number: i,
            label: (i + 1).toString(),
            active: i === offset
        });
    }

    return pages;
}
