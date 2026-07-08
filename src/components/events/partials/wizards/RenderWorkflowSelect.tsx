import { FormikProps } from "formik";
import { Workflow } from "../../../../slices/workflowSlice";
import { useTranslation } from "react-i18next";
import DropDown from "../../../shared/DropDown";
import { setDefaultValues } from "../../../../utils/workflowPanelUtils";
import { formatWorkflowsForDropdown } from "../../../../utils/dropDownUtils";

/**
 * This component renders the dropdown for the workflow select tab
 */
interface RequiredFormProps {
	workflowId: string
}
const RenderWorkflowSelect = <T extends RequiredFormProps>({
  formik,
  workflowDefinitions,
  disabled = false,
}: {
  formik: FormikProps<T>
  workflowDefinitions: Workflow[]
  disabled?: boolean
}) => {
  const { t } = useTranslation();

  return (
    <>
      {workflowDefinitions.length > 0 ? (
        <div className="editable">
          <DropDown
            value={formik.values.workflowId}
            text={
              workflowDefinitions.find(
                workflow =>
                  formik.values.workflowId === workflow.id,
              )?.title ?? ""
            }
            options={formatWorkflowsForDropdown(workflowDefinitions)}
            required={true}
            handleChange={element => {
              if (element) {
                setDefaultValues(formik, workflowDefinitions, element.value);
              }
            }}
            placeholder={t(
              "EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW",
            )}
            disabled={disabled}
            customCSS={{ width: "100%" }}
          />
        </div>
      ) : (
        <span>
          {t("EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW_EMPTY")}
        </span>
      )}
    </>
  );
};

export default RenderWorkflowSelect;
