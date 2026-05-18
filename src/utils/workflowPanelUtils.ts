import { FormikProps } from "formik";
import { Workflow, FieldSetField } from "../slices/workflowSlice";

// Set workflow id in formik when changing workflow, and initialize configuration
export const setDefaultValues = <T extends { workflowId: string} >(
	formik: FormikProps<T>,
	workflowDefinitions: Workflow[],
	workflowId: string,
) => {
	// fill values with default configuration of chosen workflow
	const defaultConfiguration = setDefaultConfig(workflowDefinitions, workflowId);

	// set default configuration in formik
	formik.setFieldValue("configuration", defaultConfiguration);
	// set chosen workflow in formik
	formik.setFieldValue("workflowId", workflowId);
};

// fill values with default configuration of chosen workflow
export const setDefaultConfig = (workflowDefinitions: Workflow[], workflowId: string) => {
	let defaultConfiguration: { [key: string]: unknown } = {};

	// find configuration panel information about chosen workflow
	const configPanel = workflowDefinitions.find(
		workflow => workflow.id === workflowId,
	)?.configurationPanelJson;

	// only set default values if there is an configuration panel
	if (Array.isArray(configPanel) && configPanel.length > 0) {
		// iterate through all config options and set their defaults
		configPanel.forEach(configOption => {
			if (configOption.fieldset) {
				defaultConfiguration = fillDefaultConfig(
					configOption.fieldset,
					defaultConfiguration,
				);
			}
		});
	}

	return defaultConfiguration;
};

// fills default configuration with values
const fillDefaultConfig = (
	fieldset: FieldSetField[],
	defaultConfiguration: { [key: string]: unknown },
) => {
	// iteration through each input field
	fieldset.forEach(field => {

    // set only the checked input of radio button as default value
    if (field.type === "radio" && field.checked) {
      defaultConfiguration[field.name] = field.value;
    } else if (field.type === "datetime-local") {
      const date = new Date(new Date().toString().split("GMT")[0] + " UTC").toISOString().split(".")[0];
      defaultConfiguration[field.name] = date;
      field.defaultValue = date;
    // set value in default configuration
    } else {
      defaultConfiguration[field.name] = field.value;
    }

		// if an input has further configuration then go through fillDefaultConfig again
		if (field.fieldset) {
			defaultConfiguration = fillDefaultConfig(
				field.fieldset,
				defaultConfiguration,
			);
		}
	});

	return defaultConfiguration;
};
