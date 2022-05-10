import {
    LOAD_EVENT_METADATA_FAILURE,
    LOAD_EVENT_METADATA_IN_PROGRESS, LOAD_EVENT_METADATA_SUCCESS,
    LOAD_EVENTS_FAILURE,
    LOAD_EVENTS_IN_PROGRESS,
    LOAD_EVENTS_SUCCESS, SET_EVENT_COLUMNS, SET_EVENT_SELECTED,
    SHOW_ACTIONS_EVENTS
} from '../actions/eventActions';
import {eventsTableConfig} from "../configs/tableConfigs/eventsTableConfig";

/**
 * This file contains redux reducer for actions affecting the state of events
 */

// Fill columns initially with columns defined in eventsTableConfig
const initialColumns = eventsTableConfig.columns.map(column =>
    ({
        ...column,
        deactivated: false
    }));

// Initial state of events in redux store
const initialState = {
    isLoading: false,
    total: 0,
    count: 0,
    limit: 0,
    offset: 0,
    results: [],
    columns: initialColumns,
    showActions: false,
    metadata: {}
}

// Reducer for events
const events = (state=initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOAD_EVENTS_IN_PROGRESS: {
            return {
                ...state,
                isLoading: true
            }
        }
        case LOAD_EVENTS_SUCCESS: {
            const { events } = payload;
            return {
                ...state,
                isLoading: false,
                total: events.total,
                count: events.count,
                limit: events.limit,
                offset: events.offset,
                results: events.results
            }
        }
        case LOAD_EVENTS_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }
        case SHOW_ACTIONS_EVENTS: {
            const { isShowing } = payload;
            return {
                ...state,
                showActions: isShowing
            }
        }
        case SET_EVENT_COLUMNS: {
            const { updatedColumns } = payload;
            return {
                ...state,
                columns: updatedColumns
            }
        }
        case SET_EVENT_SELECTED: {
            const { id } = payload;
            return {
                ...state,
                rows: state.rows.map(row => {
                    if (row.id === id) {
                        return {
                            ...row,
                            selected: !row.selected
                        }
                    }
                    return row;
                })
            }
        }
        case LOAD_EVENT_METADATA_IN_PROGRESS: {
            return {
                ...state,
                isLoading: true
            }
        }
        case LOAD_EVENT_METADATA_SUCCESS: {
            const { metadata } = payload;
            return {
                ...state,
                isLoading: false,
                metadata: metadata
            }
        }
        case LOAD_EVENT_METADATA_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }
        default:
            return state;
    }
};

export default events;
