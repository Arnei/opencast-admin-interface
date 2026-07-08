import { Formik } from "formik";
import NewUserGeneralTab from "./NewUserGeneralTab";
import UserRolesTab from "./UserRolesTab";
import { initialFormValuesNewUser } from "../../../../configs/modalConfig";
import { getUsernames } from "../../../../selectors/userSelectors";
import { NewUserSchema } from "../../../../utils/validate";
import { NewUser, postNewUser, UserRole } from "../../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Role } from "../../../../slices/aclSlice";
import WizardStepper, { WizardStep } from "../../../shared/wizard/WizardStepper";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import NewUserSummaryPage from "./NewUserSummaryPage";

/**
 * This component renders the new user wizard
 */
const NewUserWizard = ({
	close,
}: {
	close: () => void,
}) => {
	const dispatch = useAppDispatch();

	const usernames = useAppSelector(state => getUsernames(state));

	const {
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	} = usePageFunctions(0);

	type StepName = "metadata" | "roles" | "summary";
	type Step = WizardStep & {
		name: StepName,
	}

	// Caption of steps used by Stepper
	const steps: Step[] = [
		{
			translation: "USERS.USERS.DETAILS.TABS.USER",
			name: "metadata",
		},
		{
			translation: "USERS.USERS.DETAILS.TABS.ROLES",
			name: "roles",
		},
		{
			translation: "USERS.USERS.DETAILS.TABS.SUMMARY",
			name: "summary",
		},
	];

	const handleSubmit = (values: {
			username: string,
			name: string,
			email: string,
			password: string,
			roles: Role[],
			assignedRoles: UserRole[],
	}) => {
		const newValues: NewUser = {
			username: values.username,
			name: values.name,
			email: values.email,
			password: values.password,
			roles: values.assignedRoles,
		};
		const response = dispatch(postNewUser(newValues));
		console.info(response);
		close();
	};

	return (
		<>
			{/* Initialize overall form */}
			<Formik
				initialValues={initialFormValuesNewUser}
				validationSchema={NewUserSchema(usernames)}
				onSubmit={values => handleSubmit(values)}
			>
				{/* Render wizard tabs depending on current value of tab variable */}
				{formik => {
					return (
						<>
							<WizardStepper
								steps={steps}
								activePageIndex={page}
								setActivePage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								isValid={formik.isValid}
							/>
							{steps[page].name === "metadata" &&
								<NewUserGeneralTab
									formik={formik}
									nextPage={nextPage}
								/>
							}
							{steps[page].name === "roles" &&
								<UserRolesTab
									formik={formik}
									nextPage={nextPage}
									previousPage={previousPage}
								/>
							}
							{steps[page].name === "summary" &&
								<NewUserSummaryPage
									formik={formik}
									previousPage={previousPage}
								/>
							}
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default NewUserWizard;
