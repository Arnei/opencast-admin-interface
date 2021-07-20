import React, {useEffect} from "react";
import {Field} from "formik";
import {useTranslation} from "react-i18next";
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import {fetchWorkflowDef} from "../../../../thunks/workflowThunks";
import {getWorkflowDef} from "../../../../selectors/workflowSelectors";
import {connect} from "react-redux";
import cn from 'classnames';

/**
 * This component renders the workflow selection for start task bulk action
 */
const StartTaskWorkflowPage = ({ formik, previousPage, nextPage, loadingWorkflowDef, workflowDef }) => {
    const { t } = useTranslation();

    useEffect(() => {
        // Load workflow definitions for selecting
        loadingWorkflowDef();
    }, []);

    return (
        <>
            <div className="modal-content">
                <div className="modal-body">
                    <div className="full-col">
                        {/* Workflow definition Selection*/}
                        <div className="obj list-obj">
                            <header>{t('BULK_ACTIONS.SCHEDULE_TASK.TASKS.SELECT')}</header>
                            <div className="obj-container">
                                {workflowDef.length > 0 && (
                                        <Field tabIndex="99"
                                                name="workflow"
                                                as="select"
                                                style={{width: '100%'}}>
                                            <option value="" hidden>{t('EVENTS.EVENTS.DETAILS.PUBLICATIONS.SELECT_WORKFLOW')}</option>
                                            {workflowDef.map((workflow, key)=> (
                                                <option key={key} value={workflow.id}>{workflow.title}</option>
                                            ))}
                                        </Field>
                                    )}
                                {formik.values.workflow  && (
                                    <>
                                        {/* Configuration panel of selected workflow */}
                                        {/*Todo: Needs to be implemented after adjustments in definition files done*/}
                                        <div id="new-event-workflow-configuration"
                                             className="checkbox-container obj-container">
                                            <RenderWorkflowConfig workflowId={formik.values.workflow} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button for navigation to next page and previous page */}
            <footer>
                <button type="submit"
                        className={cn("submit",
                            {
                                active: (formik.values.workflow && formik.isValid),
                                inactive: !(formik.values.workflow && formik.isValid)
                            })}
                        disabled={!(formik.values.workflow && formik.isValid)}
                        onClick={() => {
                            nextPage(formik.values);
                        }}
                        tabIndex="100">{t('WIZARD.NEXT_STEP')}</button>
                <button className="cancel"
                        onClick={() => previousPage()}
                        tabIndex="101">{t('WIZARD.BACK')}</button>
            </footer>

            <div className="btm-spacer"/>
        </>
    );
};

// Getting state data out of redux store
const mapStateToProps = state => ({
    workflowDef: getWorkflowDef(state)
});

// Mapping actions to dispatch
const mapDispatchToProps = dispatch => ({
    loadingWorkflowDef: () => dispatch(fetchWorkflowDef('tasks'))
});

export default connect(mapStateToProps, mapDispatchToProps)(StartTaskWorkflowPage);
