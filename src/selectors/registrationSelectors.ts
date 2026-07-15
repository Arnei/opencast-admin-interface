import { RootState } from "../store";

/**
 * This file contains selectors regarding information about the registration status
 */
// Are we registered at all
export const getRegistration = (state: RootState) => state.registration.registration;
// Are we able to talk to register.opencast.org
export const getAbleToRegister = (state: RootState) => state.registration.ableToRegister;
// Does our registration match the latest ToU on the core
export const getAgreedLatestToU = (state: RootState) => state.registration.agreedToToU;
