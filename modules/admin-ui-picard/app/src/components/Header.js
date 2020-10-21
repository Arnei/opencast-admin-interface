// React imports
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

// service and library imports
import i18n from "../i18n/i18n";
import languages from "../i18n/languages";
import services from "../mocks/restServiceMonitor";


// image and icon imports
import opencastLogo from '../img/opencast-white.svg';

import {FaBell, FaChevronDown, FaPlayCircle, FaPowerOff, FaQuestionCircle, FaVideo} from "react-icons/fa";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {fetchHealthStatus} from "../thunks/healthThunks";
import {getHealthStatus} from "../selectors/healthSelectors";


// Todo: Find suitable place to define them and get these links out of config-file or whatever
const mediaModuleUrl = "http://localhost:8080/engage/ui/index.html";
const studio = "https://opencast.org/";
const documentationUrl = "https://opencast.org/";
const restUrl = "https://opencast.org/";


// Get code, flag and name of the current language
let currentLang = languages.find(({ code }) => code === i18n.language);
if (typeof currentLang === 'undefined') {
    currentLang = languages.find(({ code }) => code === "en-GB");
}
const currentLanguage = currentLang;



// References for detecting a click outside of the container of the dropdown menus
const containerLang = React.createRef();
const containerHelp = React.createRef();
const containerUser = React.createRef();
const containerNotify = React.createRef();

function changeLanguage(code) {
    // Load json-file of the language with provided code
    i18n.changeLanguage(code);
    // Reload window for updating the flag of the language dropdown menu
    window.location.reload();
}

function showHotkeyCheatSheet() {
    //todo: Implement method
    console.log('Show Hot Keys');
}

//Todo: implement logout-method
function logout() {
    console.log('logout');
}



/**
 * Component that renders the header and the navigation in the upper right corner.
 */
const Header = ({ loadingHealthStatus, healthStatus }) => {
    const { t } = useTranslation();
    // State for opening (true) and closing (false) the dropdown menus for language, notification, help and user
    const [displayMenuLang, setMenuLang] = useState(false);
    const [displayMenuUser, setMenuUser] = useState(false);
    const [displayMenuNotify, setMenuNotify] = useState(false);
    const [displayMenuHelp, setMenuHelp] = useState(false);

    useEffect(() => {
        // Function for handling clicks outside of an open dropdown menu
        const handleClickOutside = e => {
            if (containerLang.current && !containerLang.current.contains(e.target)) {
                setMenuLang(false);
            }

            if (containerHelp.current && !containerHelp.current.contains(e.target)) {
                setMenuHelp(false);
            }

            if (containerUser.current && !containerUser.current.contains(e.target)) {
                setMenuUser(false);
            }

            if (containerNotify.current && !containerNotify.current.contains(e.target)) {
                setMenuNotify(false);
            }
        }

        // Fetching health status information at mount
        // TODO: When to fetch? How to do it every <insertPeriod>?
        loadingHealthStatus();

        // Event listener for handle a click outside of dropdown menu
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return(
        <header className="primary-header">
            {/* Opencast logo in upper left corner */}
            <div className="header-branding">
                <a href="/" target="_self" className="logo">
                    <img src={opencastLogo} alt="Opencast Logo"/>
                </a>
            </div>

            {/* Navigation with icons and dropdown menus in upper right corner */}
            <nav className="header-nav nav-dd-container" id="nav-dd-container">
                {/* Select language */}
                <div className="nav-dd lang-dd" id="lang-dd" ref={containerLang}>
                    <div className="lang" title={t('LANGUAGE')}  onClick={() => setMenuLang(!displayMenuLang)}>
                        <img src={currentLanguage.flag} alt={currentLanguage.code} />
                    </div>
                    {/* Click on the flag icon, a dropdown menu with all available languages opens */}
                    { displayMenuLang && (
                        <MenuLang />
                    )}
                </div>

                {/* Media Module */}
                {/* Show icon only if mediaModuleUrl is set*/}
                {!!mediaModuleUrl && (
                    <div className="nav-dd" title={t('MEDIAMODULE')}>
                        <a href={mediaModuleUrl}>
                            <FaPlayCircle className="fa fa-play-circle"/>
                        </a>
                    </div>
                )}

                {/* Opencast Studio */}
                {/* Todo: before with 'with Role="ROLE_STUDIO": What is this? implement React equivalent */}
                <div className="nav-dd" title="Studio">
                    <a href={studio}>
                        <FaVideo className="fa fa-video-circle"/>
                    </a>
                </div>

                {/* System warnings and notifications */}
                {/* Todo: before with 'with Role="ROLE_ADMIN": What is this? implement React equivalent */}
                <div className="nav-dd info-dd" id="info-dd" title={t('SYSTEM_NOTIFICATIONS')} ref={containerNotify}>
                    <div onClick={() => setMenuNotify(!displayMenuNotify)}>
                        <FaBell className="fa fa-bell" aria-hidden="true"/>
                        <span id="error-count" className="badge" >{services.numErr}</span>
                        {/* Click on the bell icon, a dropdown menu with all services in serviceList and their status opens */}
                        {displayMenuNotify && (
                            <MenuNotify healthStatus={healthStatus}/>
                        )}
                    </div>
                </div>

                {/* Help */}
                {/* Show only if documentationUrl or restdocsUrl is set */}
                {(!!documentationUrl || !!restUrl) && (
                    <div title="Help" className="nav-dd" id="help-dd" ref={containerHelp} >
                        <FaQuestionCircle className="fa fa-question-circle" onClick={() => setMenuHelp(!displayMenuHelp)}/>
                        {/* Click on the help icon, a dropdown menu with documentation, REST-docs and shortcuts (if available) opens */}
                        {displayMenuHelp && (
                            <MenuHelp />
                        )}
                    </div>
                )}

                {/* Username */}
                <div className="nav-dd user-dd" id="user-dd" ref={containerUser}>
                    {/* Todo: User name of currently logged in user*/}
                    <div className="h-nav" onClick={() => setMenuUser(!displayMenuUser)}>Here is space for a name <FaChevronDown className="dropdown-icon"/></div>
                    {/* Click on username, a dropdown menu with the option to logout opens */}
                    {displayMenuUser && (
                        <MenuUser />
                    )}
                </div>

            </nav>
        </header>
    );
};

const MenuLang = () => {
    return (
        <ul className="dropdown-ul">
            {/* one list item for each available language */}
            {languages.map((language, key) => (
                <li key={key}>
                    <a onClick={() => changeLanguage(language.code)}>
                        <img className="lang-flag"
                             src={language.flag}
                             alt={language.code}/>
                        {language.long}
                    </a>
                </li>
            ))}

        </ul>
    )
};

const MenuNotify = ({ healthStatus }) => (
    <ul className="dropdown-ul">
        {/* For each service in the serviceList (ActiveMQ and Background Services) one list item */}
        {healthStatus.map((service, key) => (
            <li key={key}>
                {!!service.status && (
                    <a>
                        <span> {service.name} </span>
                        {service.error ? (
                            <span className="ng-multi-value ng-multi-value-red">{service.status}</span>
                        ) : (
                            <span className="ng-multi-value ng-multi-value-green">{service.status}</span>
                        )}
                    </a>
                )}
            </li>
        ))}

    </ul>
);

const MenuHelp = () => {
    const { t } = useTranslation();
    return(
        <ul className="dropdown-ul">
            {/* Show only if documentationUrl is set */}
            {!!documentationUrl && (
                <li>
                    <a href={documentationUrl}>
                        <span>{t('HELP.DOCUMENTATION')}</span>
                    </a>
                </li>
            )}
            {/* Todo: only if restUrl is there and with-role="ROLE_ADMIN */}
            {/* Show only if restUrl is set */}
            {!!restUrl && (
                <li>
                    <a target="_self" href={restUrl}>
                        <span>{t('HELP.REST_DOC')}</span>
                    </a>
                </li>
            )}
            <li>
                <a onClick={() => showHotkeyCheatSheet}>
                    <span>{t('HELP.HOTKEY_CHEAT_SHEET')}</span>
                </a>
            </li>
        </ul>
    )
};

const MenuUser = () => {
    const { t } = useTranslation();
    return (
        <ul className="dropdown-ul">
            <li>
                <a onClick={() => logout}>
                <span>
                    <FaPowerOff className="logout-icon"/>
                    {t('LOGOUT')}
                </span>
                </a>
            </li>
        </ul>
    )
};

// Getting state data out of redux store
const mapStateToProps = state => ({
    healthStatus: getHealthStatus(state)
});

// Mapping actions to dispatch
const mapDispatchToProps = dispatch => ({
    loadingHealthStatus: () => dispatch(fetchHealthStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
