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
import {usersTemplateMap} from "../../configs/tableConfigs/usersTableConfig";
import {getUsers} from "../../selectors/userSelectors";
import {fetchUsers} from "../../thunks/userThunks";
import {loadGroupsIntoTable, loadUsersIntoTable} from "../../thunks/tableThunks";
import {fetchGroups} from "../../thunks/groupThunks";

const Users = ({ loadingUsers, loadingUsersIntoTable, users, loadingFilters,
                   loadingGroups, loadingGroupsIntoTable }) => {
    const { t } = useTranslation();
    const [displayNavigation, setNavigation] = useState(false);

    const loadUsers = async () => {
        // Fetching users from server
        await loadingUsers();

        // Load users into table
        loadingUsersIntoTable();
    }

    const loadGroups = () => {
        // Fetching groups from server
        loadingGroups();

        // Load groups into table
        loadingGroupsIntoTable();
    }

    const loadAccess = () => {
        console.log('To be implemented');
    }

    useEffect(() => {
        // Load jobs on mount
        loadUsers().then(r => console.log(r));

        // Load filters
        loadingFilters('users');

    }, []);

    const toggleNavigation = () => {
        setNavigation(!displayNavigation);
    }

    const placeholder = () => {
        console.log("To be implemented");
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

                {/* Add user button */}
                <div className="btn-group">
                    {/*todo: implement onClick and with role*/}
                    <button className="add" onClick={() => placeholder()}>
                        <i className="fa fa-plus"/>
                        <span>{t('USERS.ACTIONS.ADD_USER')}</span>
                    </button>
                </div>

                {/* Include Burger-button menu*/}
                <MainNav isOpen={displayNavigation}
                         toggleMenu={toggleNavigation} />

                <nav>
                    {/*todo: with role*/}
                    <Link to="/users/users"
                          className={cn({active: true})}
                          onClick={() => loadUsers()}>
                        {t('USERS.NAVIGATION.USERS')}
                    </Link>
                    <Link to="/users/groups"
                          className={cn({active: false})}
                          onClick={() => loadGroups()}>
                        {t('USERS.NAVIGATION.GROUPS')}
                    </Link>
                    <Link to="/users/acls"
                          className={cn({active: false})}
                          onClick={() => loadAccess()}>
                        {t('USERS.NAVIGATION.PERMISSIONS')}
                    </Link>
                </nav>
            </section>

            <div className="main-view" style={displayNavigation ? styleNavOpen : styleNavClosed}>
                {/*Todo: What is data-admin-ng-notifications?*/}

                <div  className="controls-container">
                    {/* Include filters component */}
                    <TableFilters loadResource={loadingUsers}
                                  loadResourceIntoTable={loadingUsersIntoTable}
                                  resource={'users'}/>
                    <h1>{t('USERS.USERS.TABLE.CAPTION')}</h1>
                    <h4>{t('TABLE_SUMMARY', { numberOfRows: users.length})}</h4>
                </div>
                {/* Include table component */}
                <Table templateMap={usersTemplateMap} />
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    users: getUsers(state)
});

const mapDispatchToProps = dispatch => ({
    loadingFilters: resource => dispatch(fetchFilters(resource)),
    loadingUsers: () => dispatch(fetchUsers()),
    loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
    loadingGroups: () => dispatch(fetchGroups()),
    loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
