import React from "react";
import cn from "classnames";
import {useTranslation} from "react-i18next";
import {getEventMetadata} from "../../../../selectors/eventSelectors";
import {connect} from "react-redux";
import {uploadAssetOptions} from "../../../../configs/wizard/sourceConfig";
import {getWorkflowDef} from "../../../../selectors/workflowSelectors";
import MetadataSummaryTable from "./summaryTables/MetadataSummaryTable";
import MetadataExtendedSummaryTable from "./summaryTables/MetadataExtendedSummaryTable";
import AccessSummaryTable from "./summaryTables/AccessSummaryTable";

/**
 * This component renders the summary page for new events in the new event wizard.
 */
const NewEventSummary = ({ previousPage, formik, metaDataExtendedHidden, assetUploadHidden,
                             metadataEvents, workflowDef }) => {
    const { t } = useTranslation();

    // Get upload assets that are not of type track
    const uploadAssetsOptionsNonTrack = uploadAssetOptions.filter(asset => asset.type !== 'track');

    // upload asset that user has provided
    let uploadAssetsNonTrack = [];
    for (let i = 0; uploadAssetsOptionsNonTrack.length > i; i++) {
        let fieldValue = formik.values[uploadAssetsOptionsNonTrack[i].id];
        if (!!fieldValue) {
            uploadAssetsNonTrack = uploadAssetsNonTrack.concat({
                name: uploadAssetsOptionsNonTrack[i].id,
                translate: uploadAssetsOptionsNonTrack[i].translate,
                type:uploadAssetsOptionsNonTrack[i].type,
                flavorType: uploadAssetsOptionsNonTrack[i].flavorType,
                flavorSubType: uploadAssetsOptionsNonTrack[i].flavorSubType,
                value: fieldValue
            });
        }
    }

    // Get additional information about chosen workflow definition
    const workflowDefinition = workflowDef.find(workflow => workflow.id === formik.values.processingWorkflow);

    return(
        <>
            <div className="modal-content">
                <div className="modal-body">
                    <div className="full-col">
                        {/*Summary metadata*/}
                        <MetadataSummaryTable metadataFields={metadataEvents.fields}
                                              formikValues={formik.values}
                                              header={'EVENTS.EVENTS.NEW.METADATA.CAPTION'}/>

                        {/*Summary metadata extended*/}
                        {/*todo: metadata extended not implemented yet, so there are no values provided by user yet*/}
                        {!metaDataExtendedHidden ? (
                            <MetadataExtendedSummaryTable header={'EVENTS.EVENTS.NEW.METADATA_EXTENDED.CAPTION'}/>
                        ): null}

                        {/*Summary upload assets*/}
                        {/*Show only if asset upload page is not hidden, the sourceMode is UPLOAD and the there
                        are actually upload assets provided by the user*/}
                        {!assetUploadHidden && formik.values.sourceMode === 'UPLOAD' && uploadAssetsNonTrack.length > 0 ? (
                            <div className="obj tbl-list">
                                <header className="no-expand">{t('EVENTS.EVENTS.NEW.UPLOAD_ASSET.CAPTION')}</header>
                                <div className="obj-container">
                                    <table className="main-tbl">
                                        <tbody>
                                            {/*Insert row for each upload asset user has provided*/}
                                            {uploadAssetsNonTrack.map((asset, key) => (
                                                <tr key={key}>
                                                    <td>
                                                        {asset.name}
                                                        <span className="ui-helper-hidden">
                                                            ({asset.type} "{asset.flavorType}//{asset.flavorSubType}")
                                                        </span>
                                                    </td>
                                                    <td>{asset.value.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}


                        {/* Summary source */}
                        <div className="obj tbl-list">
                            <header className="no-expand">{t('EVENTS.EVENTS.NEW.SOURCE.CAPTION')}</header>
                            <div className="obj-container">
                                {/*Summary source mode UPLOAD*/}
                                {formik.values.sourceMode === 'UPLOAD' && (
                                    <table className="main-tbl">
                                        <tbody>
                                            {/*Insert row for each upload asset of type track user has provided*/}
                                            {formik.values.uploadAssetsTrack.map((asset, key) => (
                                                !!asset.file ? (
                                                    <tr key={key}>
                                                        <td>{t(asset.translate + ".SHORT")}
                                                            <span className="ui-helper-hidden">
                                                            ({asset.type} "{asset.flavorType}//{asset.flavorSubType}")
                                                        </span>
                                                        </td>
                                                        <td>{asset.file.name}</td>
                                                    </tr>
                                                ) : null
                                            ))}
                                        <tr>
                                            <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE')}</td>
                                            <td>{t('dateFormats.date.short', { date: new Date(formik.values.startDate) })}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )}
                                {/*Summary source mode SCHEDULE-SINGLE/SCHEDULE-MULTIPLE*/}
                                {(formik.values.sourceMode === 'SCHEDULE_SINGLE' || formik.values.sourceMode === 'SCHEDULE_MULTIPLE') && (
                                    <table className="main-tbl">
                                        <tbody>
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE')}</td>
                                                <td>{t('dateFormats.date.short', { date: formik.values.scheduleStartDate })}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_TIME')}</td>
                                                <td>{formik.values.scheduleStartTimeHour}:{formik.values.scheduleStartTimeMinutes}</td>
                                            </tr>
                                            {formik.values.sourceMode === 'SCHEDULE_MULTIPLE' && (
                                                <tr>
                                                    <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_DATE')}</td>
                                                    <td>{t('dateFormats.date.short', { date: formik.values.scheduleEndDate })}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_TIME')}</td>
                                                <td>{formik.values.scheduleEndTimeHour}:{formik.values.scheduleEndTimeMinutes}</td>
                                            </tr>
                                            {formik.values.sourceMode === 'SCHEDULE_MULTIPLE' && (
                                                <tr>
                                                    <td>{t('EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.WEEKDAYS')}</td>
                                                    <td>{formik.values.repeatOn.join(', ')}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.DURATION')}</td>
                                                <td>{formik.values.scheduleDurationHour}:{formik.values.scheduleDurationMinutes}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION')}</td>
                                                <td>{formik.values.location}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('EVENTS.EVENTS.NEW.SUMMARY.SOURCE.INPUT')}</td>
                                                <td>{formik.values.deviceInputs.join(', ')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                            </div>
                        </div>

                        {/*Summary processing configuration*/}
                        <div className="obj tbl-list">
                            <header className="no-expand">
                                {t('EVENTS.EVENTS.NEW.PROCESSING.CAPTION')}
                            </header>
                            <table className="main-tbl">
                                <tbody>
                                    <tr>
                                        <td>{t('EVENTS.EVENTS.NEW.PROCESSING.WORKFLOW')}</td>
                                        <td>{workflowDefinition.title}</td>
                                    </tr>
                                    {/*todo: repeat entry for each configuration key/value pair*/}
                                    <tr>
                                        <td>Configuration key</td>
                                        <td>Configuration value</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/*Summary access configuration*/}
                        <AccessSummaryTable policies={formik.values.policies}
                                            header={'EVENTS.EVENTS.NEW.ACCESS.CAPTION'}/>
                    </div>
                </div>
            </div>
            {/* Button for navigation to next page and previous page */}
            <footer>
                <button type="submit"
                        className={cn("submit",
                            {
                                active: (formik.dirty && formik.isValid),
                                inactive: !(formik.dirty && formik.isValid)
                            })}
                        disabled={!(formik.dirty && formik.isValid)}
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                        tabIndex="100">{t('WIZARD.CREATE')}</button>
                <button className="cancel"
                        onClick={() => previousPage(formik.values, false)}
                        tabIndex="101">{t('WIZARD.BACK')}</button>
            </footer>

            <div className="btm-spacer"/>
        </>
    )
}

const mapStateToProps = state => ({
    metadataEvents: getEventMetadata(state),
    workflowDef: getWorkflowDef(state)
})

export default connect(mapStateToProps)(NewEventSummary);
