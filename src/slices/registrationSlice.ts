import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { WritableDraft } from "immer";
import { createAppAsyncThunk } from "../createAsyncThunkWithTypes";

export type Registration = {
  adopterKey: string,
  statisticsKey: string,
  organisationName: string,
  departmentName: string,
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  postalCode: string,
  street: string,
  streetNo: string,
  contactMe: boolean,
  systemType: string,
  allowsStatistics: boolean,
  allowsErrorReports: boolean,
  dateCreated: string,
  dateUpdated: string,
  agreedToPolicy: boolean,
  registered: boolean,
  termsVersionAgreed: string,
  deleteMe: boolean,
}

export type RegistrationState = {
  registration: Registration | null,
  latestToU: string,
  isRegistering: boolean,
  agreedToToU: boolean,
  error: boolean
};

type Temp = {
  registration: Registration | null,
  latestToU: string,
};

// Initial state of health status in redux store
const initialState: RegistrationState = {
  registration: null,
  latestToU: "uninitialized",
  isRegistering: false,
  agreedToToU: false,
  error: false,
};

// This is the registration itself
export const fetchRegistration = createAppAsyncThunk("registration/fetchRegistration", async () => {
  const res = await axios.get<Registration>("/admin-ng/adopter/registration");
  return res.data;
});

// This is the latest ToU ID.  It's a string like APRIL_2020.
export const fetchLatestToU = createAppAsyncThunk("registration/fetchLatestToU", async () => {
  const res = await axios.get<string>("/admin-ng/adopter/latestToU");
  return res.data;
});

// This is whether the core can talk to register.opencast.org.
export const fetchIsUpToDate = createAppAsyncThunk("registration/isUpToDate", async () => {
  const res = await axios.get<boolean>("/admin-ng/adopter/isUpToDate");
  return res.data;
});

const registrationSlice = createSlice({
	name: "registration",
	initialState,
	reducers: {
		setError(state, action: PayloadAction<{
			error: RegistrationState["error"],
		}>) {
			state.error = action.payload.error;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			/* .addCase(fetchRegistration.pending, state => {
				state.statusHealth = "loading";
			}) */
			.addCase(fetchRegistration.fulfilled, (state, action: PayloadAction<
				Registration
			>) => {
        state.registration = action.payload;
        const updatedState = {
          registration: state.registration,
          latestToU: state.latestToU,
        };
        state.agreedToToU = agreedLatestTerms(state, updatedState);
			})
			.addCase(fetchLatestToU.fulfilled, (state, action: PayloadAction<
				string
			>) => {
        state.latestToU = action.payload;
        const updatedState = {
          registration: state.registration,
          latestToU: state.latestToU,
        };
        state.agreedToToU = agreedLatestTerms(state, updatedState);
			})
			.addCase(fetchIsUpToDate.fulfilled, (state, action: PayloadAction<
				boolean
			>) => {
        // This is true if the core can talk to https://register.opencast.org/, false otherwise
        state.isRegistering = action.payload;
			})
			/* .addCase(fetchHealthStatus.rejected, (state, action) => {
        state.error = true;
			}) */;
	},
});

const agreedLatestTerms = (_state: WritableDraft<RegistrationState>, updatedState: Temp) => {
  if (null != updatedState.registration && "uninitialized" != updatedState.latestToU) {
    return updatedState.registration.termsVersionAgreed === updatedState.latestToU;
  }
  return false;
};

export const { setError } = registrationSlice.actions;

// Export the slice reducer as the default export
export default registrationSlice.reducer;
