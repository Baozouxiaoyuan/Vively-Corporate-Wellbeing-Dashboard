import * as backendApi from "./backendApi";
import * as mockApi from "./mockApi";

const api = import.meta.env.VITE_API_MODE === "backend" ? backendApi : mockApi;

export const getCorporateAccount = api.getCorporateAccount;
export const getEmployees = api.getEmployees;
export const getTeams = api.getTeams;
export const resolveVivelyUserByEmail = api.resolveVivelyUserByEmail;
export const createEmployeeInvite = api.createEmployeeInvite;
export const sendEmployeeInviteEmail = api.sendEmployeeInviteEmail;
export const removeEmployee = api.removeEmployee;
export const getActivationSummary = api.getActivationSummary;
export const getHealthMetrics = api.getHealthMetrics;
export const getBillingSummary = api.getBillingSummary;
