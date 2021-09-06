import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import MainNav from "../shared/MainNav";
import Link from "react-router-dom/Link";
import cn from 'classnames';
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import {fetchFilters} from "../../thunks/tableFilterThunks";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {themesTemplateMap} from "../../configs/tableConfigs/themesTableConfig";
import {getTotalThemes} from "../../selectors/themeSelectors";
import {fetchThemes} from "../../thunks/themeThunks";
import {loadThemesIntoTable} from "../../thunks/tableThunks";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import {editTextFilter} from "../../actions/tableFilterActions";
import {styleNavClosed, styleNavOpen} from "../../utils/componentsUtils";
import {logger} from "../../utils/logger";

/**
 * This component renders the table view of events
 */
const Themes = ({ loadingThemes, loadingThemesIntoTable, themes, loadingFilters, resetTextFilter }) => {
    const { t } = useTranslation();
    const [displayNavigation, setNavigation] = useState(false);
    const [displayNewThemesModal, setNewThemesModal] = useState(false);

    const loadThemes = async () => {
        // Fetching themes from server
        await loadingThemes();

        // Load users into table
        loadingThemesIntoTable();
    };

    useEffect(() => {
        resetTextFilter();

        // Load themes on mount
        loadThemes().then(r => logger.info(r));

        // Load filters
        loadingFilters('themes');

        // Fetch themes every minute
        let fetchThemesInterval = setInterval(loadThemes, 100000);

        return () => clearInterval(fetchThemesInterval);

    }, []);

    const toggleNavigation = () => {
        setNavigation(!displayNavigation);
    }

    const showNewThemesModal = () => {
        setNewThemesModal(true);
    }

    const hideNewThemesModal = () => {
        setNewThemesModal(false);
    }

    return (
        <>
            <section className="action-nav-bar">
                {/* Add theme button */}
                <div className="btn-group">
                    {/*todo: implement onClick and with role*/}
                    <button className="add" onClick={() => showNewThemesModal()}>
                        <i className="fa fa-plus"/>
                        <span>{t('CONFIGURATION.ACTIONS.ADD_THEME')}</span>
                    </button>
                </div>

                {/* Display modal for new series if add series button is clicked */}
                <NewResourceModal showModal={displayNewThemesModal}
                                  handleClose={hideNewThemesModal}
                                  resource={"themes"}/>

                {/* Include Burger-button menu*/}
                <MainNav isOpen={displayNavigation}
                         toggleMenu={toggleNavigation}/>

                <nav>
                    {/* todo: with roles */}
                    <Link to="/configuration/themes"
                          className={cn({active: true})}
                          onClick={() => loadThemes()}>
                        {t('CONFIGURATION.NAVIGATION.THEMES')}
                    </Link>
                </nav>
            </section>

            <div className="main-view" style={displayNavigation ? styleNavOpen : styleNavClosed}>
                {/* Include notifications component */}
                <Notifications />

                <div  className="controls-container">
                    {/* Include filters component */}
                    <TableFilters loadResource={loadingThemes}
                                  loadResourceIntoTable={loadingThemesIntoTable}
                                  resource={'themes'}/>
                    <h1>{t('CONFIGURATION.THEMES.TABLE.CAPTION')}</h1>
                    <h4>{t('TABLE_SUMMARY', { numberOfRows: themes})}</h4>
                </div>
                {/* Include table component */}
                <Table templateMap={themesTemplateMap} />
            </div>
        </>
    );
};

// Getting state data out of redux store
const mapStateToProps = state => ({
    themes: getTotalThemes(state)
});

// Mapping actions to dispatch
const mapDispatchToProps = dispatch => ({
    loadingFilters: resource => dispatch(fetchFilters(resource)),
    loadingThemes: () => dispatch(fetchThemes()),
    loadingThemesIntoTable: () => dispatch(loadThemesIntoTable()),
    resetTextFilter: () => dispatch(editTextFilter(''))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Themes));
