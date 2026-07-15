import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { WritableDraft } from "immer";
import { createAppAsyncThunk } from "../createAsyncThunkWithTypes";

export type Registration = {
  agreedToPolicy: boolean,
  registered: boolean,
  termsVersionAgreed: string,
}

export type RegistrationState = {
  loaded: boolean,
  registration: Registration | null,
  latestToU: string,
  ableToRegister: boolean,
  agreedToToU: boolean,
  error: boolean
};

type StateUpdate = {
  registration: Registration | null,
  latestToU: string,
};

// Initial state of health status in redux store
const initialState: RegistrationState = {
  loaded: false,
  registration: null,
  latestToU: "uninitialized",
  ableToRegister: false,
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
  reducers: {},
  // These are used for thunks
  extraReducers: builder => {
    builder
      .addCase(fetchRegistration.fulfilled, (state, action: PayloadAction<
        Registration
      >) => {
        state.registration = action.payload;
        const updatedState = {
          registration: state.registration,
          latestToU: state.latestToU,
        };
        state.agreedToToU = agreedLatestTerms(state, updatedState);
        state.loaded = true;
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
        state.ableToRegister = action.payload;
      });
  },
});

const agreedLatestTerms = (_state: WritableDraft<RegistrationState>, updatedState: StateUpdate) => {
  if (null != updatedState.registration && "uninitialized" != updatedState.latestToU) {
    return updatedState.registration.termsVersionAgreed === updatedState.latestToU;
  }
  return false;
};

// Export the slice reducer as the default export
export default registrationSlice.reducer;
