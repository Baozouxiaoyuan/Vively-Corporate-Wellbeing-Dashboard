import * as backendApi from "./backendApi";
import * as mockApi from "./mockApi";

const api = import.meta.env.VITE_API_MODE === "backend" ? backendApi : mockApi;

export const login = api.login;
export const getCompany = api.getCompany;
export const getMembers = api.getMembers;
export const getTeams = api.getTeams;
export const createTeam = api.createTeam;
export const renameTeam = api.renameTeam;
export const deleteTeam = api.deleteTeam;
export const createMemberInvite = api.createMemberInvite;
export const sendMemberInvitation = api.sendMemberInvitation;
export const deleteMember = api.deleteMember;
export const getActivationSummary = api.getActivationSummary;
export const getCompanyHealthMetrics = api.getCompanyHealthMetrics;
export const getTeamHealthMetrics = api.getTeamHealthMetrics;
export const getBilling = api.getBilling;
