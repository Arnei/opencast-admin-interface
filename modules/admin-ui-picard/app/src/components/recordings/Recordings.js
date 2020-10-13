import React, {useEffect, useState} from "react";
import MainNav from "../shared/MainNav";
import {useTranslation} from "react-i18next";
import Link from "react-router-dom/Link";
import cn from 'classnames';
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {recordingsTemplateMap} from "../../configs/tableConfigs/recordingsTableConfig";
import {getRecordings} from "../../selectors/recordingSelectors";
import {fetchRecordings} from "../../thunks/recordingThunks";
import {loadRecordingsIntoTable} from "../../thunks/tableThunks";
import {fetchFilters} from "../../thunks/tableFilterThunks";

/**
 * This component renders the table view of recordings
 */
const Recordings = ({ loadingRecordings, loadingRecordingsIntoTable, recordings, loadingFilters }) => {
    const { t } = useTranslation();
    const [displayNavigation, setNavigation] = useState(false);

    const loadRecordings = async () => {
        // Fetching recordings from server
        await loadingRecordings();

        // Load recordings into table
        loadingRecordingsIntoTable();
    }

    useEffect(() => {
        // Load recordings on mount
        loadRecordings().then(r => console.log(r));

        // Load filters
        loadingFilters('recordings');
    }, []);

    const toggleNavigation = () => {
        setNavigation(!displayNavigation);
    }

    const styleNavOpen = {
        marginLeft: '130px',
    };
    const styleNavClosed = {
        marginLeft: '20px',
    };

    return (
        <>
            <section className="action-nav-bar">

                {/* Include Burger-button menu*/}
                <MainNav isOpen={displayNavigation}
                         toggleMenu={toggleNavigation}/>

                <nav>
                    {/*todo: with role*/}
                   <Link to="/recordings/recordings"
                         className={cn({active: true})}
                         onClick={() => loadRecordings()} >
                       {t('RECORDINGS.NAVIGATION.LOCATIONS')}
                   </Link>
                </nav>
            </section>

            <div className="main-view" style={displayNavigation ? styleNavOpen : styleNavClosed}>
                {/*Todo: What is data-admin-ng-notifications?*/}

                <div className="controls-container">
                    {/* Include filters component */}
                    <TableFilters loadResource={loadingRecordings}
                                  loadResourceIntoTable={loadingRecordingsIntoTable}
                                  resource={'recordings'}/>

                    <h1>{t('RECORDINGS.RECORDINGS.TABLE.CAPTION')}</h1>
                    <h4>{t('TABLE_SUMMARY', { numberOfRows: recordings.length})}</h4>
                </div>
                {/* Include table component */}
                <Table templateMap={recordingsTemplateMap} />
            </div>
        </>
    )
}

// Getting state data out of redux store
const mapStateToProps = state => ({
    recordings: getRecordings(state)
});

// Mapping actions to dispatch
const mapDispatchToProps = dispatch => ({
    loadingRecordings: () => dispatch(fetchRecordings()),
    loadingRecordingsIntoTable: () => dispatch(loadRecordingsIntoTable()),
    loadingFilters: resource => dispatch(fetchFilters(resource))
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Recordings));
