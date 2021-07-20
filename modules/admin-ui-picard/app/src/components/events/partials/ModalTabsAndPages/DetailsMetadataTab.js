import React from "react";
import {useTranslation} from "react-i18next";
import {Field, Formik} from "formik";
import cn from "classnames";
import _ from 'lodash';
import Notifications from "../../../shared/Notifications";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";

/**
 * This component renders metadata details of a certain event or series
 */
const DetailsMetadataTab = ({ metadataFields, updateResource, resourceId, buttonLabel, header }) => {
    const { t } = useTranslation();

    const handleSubmit = values => {
        updateResource(resourceId, values);
    }

    // set current values of metadata fields as initial values
    const getInitialValues = () => {
        let initialValues = {};

        // Transform metadata fields and their values provided by backend (saved in redux)
        if (!!metadataFields.fields && metadataFields.fields.length > 0) {
            metadataFields.fields.forEach(field => {
                initialValues[field.id] = field.value;
            });
        }

        return initialValues;
    }

    const checkValidity = formik => {
        if (formik.dirty && formik.isValid) {
            // check if user provided values differ from initial ones
            return !_.isEqual(formik.values, formik.initialValues);
        } else {
            return false;
        }
    }

    return (
        // initialize form
        <Formik enableReinitialize
                initialValues={getInitialValues()}
                onSubmit={values => handleSubmit(values)}>
            {formik => (
                <>
                    <div className="modal-content">
                        <div className="modal-body">
                            <Notifications context="not-corner"/>
                            <div className="full-col">
                                <div className="obj tbl-list">
                                    <header className="no-expand">
                                        {t(header)}
                                    </header>
                                    <div className="obj-container">
                                        <table className="main-tbl">
                                            <tbody>
                                            {/* Render table row for each metadata field depending on type */}
                                            {!!metadataFields.fields && metadataFields.fields.map((field, key) => (
                                                <tr key={key}>
                                                    <td>
                                                        <span>{t(field.label)}</span>
                                                        {field.required && (
                                                            <i className="required">*</i>
                                                        )}
                                                    </td>
                                                    {field.readOnly ? (
                                                        // non-editable field if readOnly is set
                                                        <td>{field.value}</td>
                                                    ) : (
                                                        <td className="editable ng-isolated-scope">
                                                            {/* todo: role: ROLE_UI_SERIES_DETAILS_METADATA_EDIT */}
                                                            {/* Render single value or multi value editable input */}
                                                            {(field.type === "mixed_text" && field.collection.length !== 0) ? (
                                                                <Field name={field.id}
                                                                       fieldInfo={field}
                                                                       showCheck
                                                                       component={RenderMultiField}/>
                                                            ) : (
                                                                <Field name={field.id}
                                                                       metadataField={field}
                                                                       showCheck
                                                                       component={RenderField}/>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {formik.dirty && (
                                        <>
                                            {/* Render buttons for updating metadata */}
                                            <footer style={{padding: '15px'}}>
                                                <button type="submit"
                                                        onClick={() => formik.handleSubmit()}
                                                        disabled={!checkValidity(formik)}
                                                        className={cn("submit",
                                                            {
                                                                active: checkValidity(formik),
                                                                inactive: !checkValidity(formik)
                                                            }
                                                        )}>
                                                    {t(buttonLabel)}
                                                </button>
                                                <button onClick={() => formik.resetForm({values: ''})}
                                                        className="cancel">
                                                    {t('CANCEL')}
                                                </button>
                                            </footer>

                                            <div className="btm-spacer"/>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Formik>
    );
};

export default DetailsMetadataTab;
