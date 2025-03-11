import React, { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useClickOutsideField } from "../../../hooks/wizardHooks";
import { FieldInputProps, FieldProps } from "formik";
import { MetadataField } from "../../../slices/eventSlice";

const childRef = React.createRef<HTMLDivElement>();

/**
 * This component renders an editable field for multiple values depending on the type of the corresponding metadata
 */
const RenderMultiField = ({
	fieldInfo,
	onlyCollectionValues = false,
	field,
	form,
	showCheck = false,
}: {
	fieldInfo: MetadataField
	onlyCollectionValues?: boolean
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
}) => {
	// const { t } = useTranslation();

	// // Indicator if currently edit mode is activated
	// const {editMode, setEditMode} = useClickOutsideField(childRef);
	// // Temporary storage for value user currently types in
	// const [inputValue, setInputValue] = useState("");

	// let fieldValue = [...field.value];

	// // Handle change of value user currently types in
	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const itemValue = e.target.value;
	// 	setInputValue(itemValue);
	// };

	// const handleKeyDown = (event: React.KeyboardEvent) => {
	// 	// Check if pressed key is Enter
	// 	if (event.keyCode === 13 && inputValue !== "") {
	// 		event.preventDefault();

	// 		submitValue();
	// 	}
	// };

	// const submitValue = (alternativeInput?: string) => {

	// 	let newInputValue = inputValue
	// 	if (alternativeInput) {
	// 		newInputValue = alternativeInput
	// 	}

	// 	if (newInputValue !== "") {
	// 		let splitArray = [];
	// 		if (fieldInfo.delimiter) {
	// 			splitArray = newInputValue.split(fieldInfo.delimiter).map(item => item.trim()).filter(Boolean);
	// 		} else {
	// 			splitArray = [newInputValue];
	// 		}

	// 		for (const newInput of splitArray) {
	// 			// Flag if only values of collection are allowed or any value
	// 			if (onlyCollectionValues) {
	// 				// add input to formik field value if not already added and input in collection of possible values
	// 				if (
	// 					!fieldValue.find((e) => e === newInput) &&
	// 					fieldInfo.collection?.find((e) => e.value === newInput)
	// 				) {
	// 					fieldValue[fieldValue.length] = newInput;
	// 					form.setFieldValue(field.name, fieldValue);
	// 				}
	// 			} else {
	// 				// add input to formik field value if not already added
	// 				if (!fieldValue.find((e) => e === newInput)) {
	// 					fieldValue[fieldValue.length] = newInput;
	// 					form.setFieldValue(field.name, fieldValue);
	// 				}
	// 		}
	// 	}

	// 		// reset inputValue
	// 		setInputValue("");
	// 	}
	// }

	// // Remove item/value from inserted field values
	// const removeItem = (key: number) => {
	// 	fieldValue.splice(key, 1);
	// 	form.setFieldValue(field.name, fieldValue);
	// };

	return (
		<Nyeh
			fieldInfo={fieldInfo}
			field={field}
			form={form}
			// text={getMetadataCollectionFieldName(fieldInfo, field, t)}
		/>
	)

	// return (
	// 	// Render editable field for multiple values depending on type of metadata field
	// 	// (types: see metadata.json retrieved from backend)
	// 	editMode ? (
	// 		<>
	// 			{fieldInfo.type === "mixed_text" && (
	// 				<EditMultiSelect
	// 					collection={fieldInfo.collection ? fieldInfo.collection : []}
	// 					field={field}
	// 					fieldValue={fieldValue}
	// 					inputValue={inputValue}
	// 					removeItem={removeItem}
	// 					handleChange={handleChange}
	// 					handleKeyDown={handleKeyDown}
	// 					handleBlur={submitValue}
	// 				/>
	// 			)}
	// 		</>
	// 	) : (
	// 		<ShowValue
	// 			setEditMode={setEditMode}
	// 			field={field}
	// 			form={form}
	// 			showCheck={showCheck}
	// 		/>
	// 	)
	// );
};

// Renders multi select
const EditMultiSelect = ({
	collection,
	handleKeyDown,
	handleChange,
	handleBlur,
	inputValue,
	removeItem,
	field,
	fieldValue,
}: {
	collection: { [key: string]: unknown }[]
	handleKeyDown: (event: React.KeyboardEvent) => void
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	handleBlur: (refCurrent: string) => void
	inputValue: HTMLInputElement["value"]
	removeItem: (key: number) => void
	field: FieldProps["field"]
	fieldValue: FieldInputProps<unknown>["value"]
}) => {
	const { t } = useTranslation();

	// onBlur does not get called if a component unmounts for some reason
	// Instead, we achieve the same effect with useEffect
	const textRef = useRef(inputValue);
	React.useEffect( () => {
		textRef.current = inputValue;
	}, [inputValue])
	React.useEffect( () => {
		return () => handleBlur(textRef.current)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div ref={childRef}>
				<div>
					<input
						type="text"
						name={field.name}
						value={inputValue}
						onKeyDown={(e) => handleKeyDown(e)}
						onChange={(e) => handleChange(e)}
						placeholder={t("EDITABLE.MULTI.PLACEHOLDER")}
						list="data-list"
						autoFocus={true}
					/>
					{/* Display possible options for values as some kind of dropdown */}
					<datalist id="data-list">
						{collection.map((item, key) => (
							<option key={key}>{item.value as ReactNode}</option>
						))}
					</datalist>
				</div>
				{/* Render blue label for all values already in field array */}
				{fieldValue instanceof Array &&
					fieldValue.length !== 0 &&
					fieldValue.map((item, key) => (
						<span className="ng-multi-value" key={key}>
							{item}
							<button className="button-like-anchor" onClick={() => removeItem(key)}>
								<i className="fa fa-times" />
							</button>
						</span>
					))}
			</div>
		</>
	);
};

// Shows the values of the array in non-edit mode
const ShowValue = ({
	setEditMode,
	form: { initialValues },
	field,
	showCheck,
}: {
  setEditMode: (e: boolean) => void
	form: FieldProps["form"]
	field: FieldProps["field"]
	showCheck: boolean,
}) => {
	return (
		<div onClick={() => setEditMode(true)} className="show-edit">
			{field.value instanceof Array && field.value.length !== 0 ? (
				<ul>
					{field.value.map((item, key) => (
						<li key={key}>
							<span>{item}</span>
						</li>
					))}
				</ul>
			) : (
				<span className="editable preserve-newlines">{""}</span>
			)}
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: JSON.stringify(initialValues[field.name] ?? []) !== JSON.stringify(field.value ?? []),
						})}
					/>
				)}
			</div>
		</div>
	);
};

const Nyeh = ({
	fieldInfo,
	field,
	form,
	showCheck = false,
}: {
	fieldInfo: MetadataField
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
}) => {
	const { t } = useTranslation();

	const editableRef = useRef<HTMLInputElement>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => { console.log("onFocus"); setFocused(true); }
	const onBlur = () => { console.log("onBlur"); setFocused(false); }



	const [inputValue, setInputValue] = useState("");

	let fieldValue = [...field.value];
	const onlyCollectionValues = false;

	// Handle change of value user currently types in
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const itemValue = e.target.value;
		setInputValue(itemValue);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		// Check if pressed key is Enter
		if (event.keyCode === 13 && inputValue !== "") {
			event.preventDefault();

			submitValue();
		}
	};

	const submitValue = (alternativeInput?: string) => {

		let newInputValue = inputValue
		if (alternativeInput) {
			newInputValue = alternativeInput
		}

		if (newInputValue !== "") {
			let splitArray = [];
			if (fieldInfo.delimiter) {
				splitArray = newInputValue.split(fieldInfo.delimiter).map(item => item.trim()).filter(Boolean);
			} else {
				splitArray = [newInputValue];
			}

			for (const newInput of splitArray) {
				// Flag if only values of collection are allowed or any value
				if (onlyCollectionValues) {
					// add input to formik field value if not already added and input in collection of possible values
					if (
						!fieldValue.find((e) => e === newInput) &&
						fieldInfo.collection?.find((e) => e.value === newInput)
					) {
						fieldValue[fieldValue.length] = newInput;
						form.setFieldValue(field.name, fieldValue);
					}
				} else {
					// add input to formik field value if not already added
					if (!fieldValue.find((e) => e === newInput)) {
						fieldValue[fieldValue.length] = newInput;
						form.setFieldValue(field.name, fieldValue);
					}
			}
		}

			// reset inputValue
			setInputValue("");
		}
	}

	// Remove item/value from inserted field values
	const removeItem = (key: number) => {
		console.log("I try")
		fieldValue.splice(key, 1);
		form.setFieldValue(field.name, fieldValue);
		console.log("I tried")
	};


	return (
		<div
			onClick={() => editableRef.current?.focus()}
			style={{display: "flex",
				// flexDirection: focused ? "column" : "row",
				justifyContent: "space-between"}}
		>

			{/* Render array as text */}
			{!focused &&
			field.value instanceof Array &&
			field.value.length !== 0 &&
				<ul>
					{field.value.map((item, key) => (
						<li key={key}>
							<span>{item}</span>
						</li>
					))}
				</ul>
			}

			{/* Render input */}
			<div
				style={{
					width: focused ? "100%" : "0%",
					// flexDirection: "column"
				}}
				onFocus={onFocus}
				onBlur={onBlur}
			>
				<input
					ref={editableRef}
					type="text"
					name={field.name}
					value={inputValue}
					className="single-value"
					onKeyDown={(e) => handleKeyDown(e)}
					onChange={(e) => handleChange(e)}
					placeholder={t("EDITABLE.MULTI.PLACEHOLDER")}
					list="data-list"
					// onFocus={onFocus}
					// onBlur={onBlur}
					style={{width: focused ? "98%" : "0%"}}
				/>

				{/* Display possible options for values as some kind of dropdown */}
				<datalist id="data-list">
					{fieldInfo.collection?.map((item, key) => (
						<option key={key}>{item.value as ReactNode}</option>
					))}
				</datalist>

				{/* Render blue label for all values already in field array */}
				{
				field.value instanceof Array &&
				field.value.length !== 0 &&
				<div>
					{field.value.map((item, key) => (
						<span className="ng-multi-value" key={key}>
							{item}
							<button className="button-like-anchor" onClick={() => removeItem(key)}>
								<i className="fa fa-times" />
							</button>
						</span>

					))}
				</div>
				}
			</div>



			{/* Render checkmark and pencils */}
			<div>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: JSON.stringify(form.initialValues[field.name] ?? []) !== JSON.stringify(field.value ?? []),
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
}
export default RenderMultiField;
