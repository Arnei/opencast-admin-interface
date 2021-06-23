import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DateTimePicker} from "@material-ui/pickers";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import cn from "classnames";


const childRef = React.createRef();
/**
 * This component renders an editable field for single values depending on the type of the corresponding metadata
 */
const RenderField = ({ field, metadataField, form, showCheck=false }) => {
    // Indicator if currently edit mode is activated
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Handle click outside the field and leave edit mode
        const handleClickOutside = e => {
            if(childRef.current && !childRef.current.contains(e.target)) {
                setEditMode(false);
            }
        }

        // Focus current field
        if (childRef && childRef.current && editMode === true) {
            childRef.current.focus();
        }

        // Adding event listener for detecting click outside
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        }
    }, [editMode]);

    // Handle key down event and check if pressed key leads to leaving edit mode
    const handleKeyDown = (event, type) => {
        const { key } = event;
        // keys pressable for leaving edit mode
        const keys = ["Escape", "Tab", "Enter"];

        if (type !== "textarea" && keys.indexOf(key) > -1) {
            setEditMode(false);
        }
    };

    return (
        // Render editable field depending on type of metadata field
        // (types: see metadata.json retrieved from backend)
        <>
            {metadataField.type === "time" && (
                <EditableSingleValueTime field={field}
                                         text={field.value}
                                         editMode={editMode}
                                         setEditMode={setEditMode}
                                         form={form}
                                         showCheck={showCheck}/>
            )}
            {((metadataField.type === "text" && !!metadataField.collection && metadataField.collection.length !== 0) ||
                metadataField.type === "ordered_text") ? (
                <EditableSingleSelect metadataField={metadataField}
                                      field={field}
                                      form={form}
                                      text={field.value}
                                      editMode={editMode}
                                      setEditMode={setEditMode}
                                      showCheck={showCheck}
                                      handleKeyDown={handleKeyDown}/>
            ) : (metadataField.type === "text" && (
                <EditableSingleValue field={field}
                                     form={form}
                                     text={field.value}
                                     editMode={editMode}
                                     setEditMode={setEditMode}
                                     showCheck={showCheck}
                                     handleKeyDown={handleKeyDown}/>
            ))}
            {metadataField.type === "text_long" && (
                <EditableSingleValueTextArea field={field}
                                             text={field.value}
                                             form={form}
                                             editMode={editMode}
                                             setEditMode={setEditMode}
                                             showCheck={showCheck}
                                             handleKeyDown={handleKeyDown}/>
            )}
            {metadataField.type === "date" && (
                <EditableDateValue field={field}
                                   text={field.value}
                                   form={form}
                                   editMode={editMode}
                                   setEditMode={setEditMode}
                                   showCheck={showCheck}/>
            )}
            {metadataField.type === "boolean" && (
                <EditableBooleanValue field={field}
                                      text={field.value}
                                      form={form}
                                      editMode={editMode}
                                      setEditMode={setEditMode}
                                      showCheck={showCheck}
                                      handleKeyDown={handleKeyDown}/>
            )}
        </>
    );
};

// Renders editable field for a boolean value
const EditableBooleanValue = ({ field, text, editMode, setEditMode, handleKeyDown, form: { initialValues }, showCheck }) => {
    return (
        editMode ? (
            <div onBlur={() => setEditMode(false)}
                 onKeyDown={e => handleKeyDown(e, "input")}
                 ref={childRef}>
                <input type="checkbox" {...field}/>
            </div>
        ) : (
            <div onClick={() => setEditMode(true)}>
                <span className="editable preserve-newlines" >{text || ''}</span>
                <i className="edit fa fa-pencil-square"/>
                {showCheck && (
                    <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                )}
            </div>
        )

    );
};

// Renders editable field for a data value
const EditableDateValue = ({ field, text, form: { setFieldValue, initialValues }, editMode, setEditMode, showCheck }) => {
    const { t } = useTranslation();

    const theme = createMuiTheme({
        props: {
            MuiDialog: {
                style: {
                    zIndex: '2147483550',
                }
            }
        }
    });

    return (
        editMode ? (
            <div>
                <ThemeProvider theme={theme}>
                    <DateTimePicker name={field.name}
                                    value={field.value}
                                    onChange={value => setFieldValue(field.name, value)}
                                    onClose={() => setEditMode(false)}
                                    fullWidth
                                    format="MM/dd/yyyy"/>
                </ThemeProvider>
            </div>
        ) : (
            <div onClick={() => setEditMode(true)}>
                <span className="editable preserve-newlines" >
                    {t('dateFormats.dateTime.short', {dateTime: new Date(text)}) || ''}
                </span>
                <i className="edit fa fa-pencil-square"/>
                {showCheck && (
                    <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                )}
            </div>
        )

    );
};

// renders editable field for selecting value via dropdown
const EditableSingleSelect = ({ field, metadataField, text, editMode, setEditMode, handleKeyDown,
                                  form: { initialValues }, showCheck }) => {
    const { t } = useTranslation();
    return (
        editMode ? (
            <div
                 onBlur={() => setEditMode(false)}
                 onKeyDown={e => handleKeyDown(e, "select")}
                 ref={childRef}>
                <select {...field}
                        data-width="'250px'">
                    {(metadataField.value === "" && !metadataField.required) && (
                        <option value="">{t('SELECT_NO_OPTION_SELECTED')}</option>
                    )}
                    {(metadataField.id === "language") ? (
                        metadataField.collection.map((item, key) => (
                                <option key={key} value={item.value}>{t(item.name)}</option>
                        ))
                    ) : (
                        // if selection of series then use item name as option label else use item value
                        metadataField.id === "isPartOf" ? (
                            metadataField.collection.map((item, key) => (
                                <option key={key} value={item.value}>{item.name}</option>
                            ))
                            ) : (
                            metadataField.collection.map((item, key) => (
                                <option key={key}>{item.value}</option>
                            ))
                        )
                    )}
                </select>
            </div>
            ) : (
             <div onClick={() => setEditMode(true)}>
                 <span className="editable preserve-newlines">
                     {text || t('SELECT_NO_OPTION_SELECTED')}
                 </span>
                 <i className="edit fa fa-pencil-square"/>
                 {showCheck && (
                     <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                 )}
             </div>
        )
    );
};

// Renders editable text area
const EditableSingleValueTextArea = ({ field, text, editMode, setEditMode, handleKeyDown, form: { initialValues }, showCheck }) => {
    return (
        editMode ? (
            <div onBlur={() => setEditMode(false)}
                 onKeyDown={e => handleKeyDown(e, "textarea")}
                 ref={childRef}>
                <textarea {...field} className="editable vertical-resize"/>
            </div>
        ) : (
            <div onClick={() => setEditMode(true)}>
                <span className="editable preserve-newlines">{text || ''}</span>
                <i className="edit fa fa-pencil-square"/>
                {showCheck && (
                    <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                )}
            </div>
        )
    );
};

// Renders editable input for single value
const EditableSingleValue = ({ field, form: { initialValues }, text, editMode, setEditMode, handleKeyDown, showCheck }) => {
    return (
        editMode ? (
            <div onBlur={() => setEditMode(false)}
                 onKeyDown={e => handleKeyDown(e, "input")}
                 ref={childRef}>
                <input {...field} type="text"/>
            </div>
        ) : (
            <div onClick={() => setEditMode(true)}>
                <span className="editable preserve-newlines" >{text || ''}</span>
                <i className="edit fa fa-pencil-square"/>
                {showCheck && (
                    <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                )}
            </div>
        )
    );
};

// Renders editable field for time value
const EditableSingleValueTime = ({ field, text, form: { setFieldValue, initialValues }, editMode, setEditMode, showCheck }) => {
    const { t } = useTranslation();

    const theme = createMuiTheme({
        props: {
            MuiDialog: {
                style: {
                    zIndex: '2147483550',
                }
            }
        }
    });

    return (
        editMode ? (
            <div>
                <ThemeProvider theme={theme}>
                    <DateTimePicker name={field.name}
                                    value={field.value}
                                    onChange={value => setFieldValue(field.name, value)}
                                    onClose={() => setEditMode(false)}
                                    fullWidth/>
                </ThemeProvider>
            </div>
        ) : (
            <div onClick={() => setEditMode(true)}>
                <span className="editable preserve-newlines">
                    {t('dateFormats.dateTime.short', {dateTime: new Date(text)}) || ''}
                </span>
                <i className="edit fa fa-pencil-square"/>
                {showCheck && (
                    <i className={cn("saved fa fa-check", { active: (initialValues[field.name] !== field.value) })}/>
                )}
            </div>
        )
    );
};


export default RenderField;
