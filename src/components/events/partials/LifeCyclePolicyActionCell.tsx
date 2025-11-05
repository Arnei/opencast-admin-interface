import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store";
import { deleteLifeCyclePolicy, LifeCyclePolicy } from "../../../slices/lifeCycleSlice";
import LifeCyclePolicyDetails from "./modals/LifeCyclePolicyDetails";
import { fetchLifeCyclePolicyDetails } from "../../../slices/lifeCycleDetailsSlice";
import { Modal, ModalHandle } from "../../shared/modals/Modal";
import ButtonLikeAnchor from "../../shared/ButtonLikeAnchor";
import { LuFileText } from "react-icons/lu";
import { ActionCellDelete } from "../../shared/ActionCellDelete";

/**
 * This component renders the title cells of series in the table view
 */
const LifeCyclePolicyActionCell = ({
	row,
}: {
	row: LifeCyclePolicy
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const modalRef = useRef<ModalHandle>(null);

	const showLifeCyclePolicyDetails = async () => {
		await dispatch(fetchLifeCyclePolicyDetails(row.id));

		modalRef.current?.open();
	};

	// const hideLifeCyclePolicyDetails = () => {
	// 	modalRef.current?.close?.();
	// };

	const deletingPolicy = (id: string) => {
		dispatch(deleteLifeCyclePolicy(id));
	};

	return (
		<>
			{/* view details location/recording */}
			<ButtonLikeAnchor
				onClick={() => showLifeCyclePolicyDetails()}
				className={"action-cell-button"}
				editAccessRole={"ROLE_UI_LIFECYCLEPOLICY_DETAILS_VIEW"}
				// tooltipText={"LIFECYCLE.POLICIES.TABLE.TOOLTIP.DETAILS"} // Disabled due to performance concerns
			>
				<LuFileText />
			</ButtonLikeAnchor>

			<Modal
				header={t("LIFECYCLE.POLICIES.DETAILS.HEADER", { name: row.title })}
				classId="user-details-modal"
				ref={modalRef}
			>
				{/* component that manages tabs of user details modal*/}
				<LifeCyclePolicyDetails />
			</Modal>

			{/* delete policy */}
			<ActionCellDelete
				editAccessRole={"ROLE_UI_LIFECYCLEPOLICY_DELETE"}
				// tooltipText={"LIFECYCLE.POLICIES.TABLE.TOOLTIP.DELETE"} // Disabled due to performance concerns
				resourceId={row.id}
				resourceName={row.title}
				resourceType={"LIFECYCLE_POLICY"}
				deleteMethod={deletingPolicy}
			/>
		</>
	);
};

export default LifeCyclePolicyActionCell;
