import { CorporateAccount, CorporatePatient } from "../types/corporate";

export const corporateAccountMock: CorporateAccount = {
  id: 1,
  company_name: "North Star Technologies",
  invite_code: "NORTHSTAR-2026",
  plan_price_cents: 29900,
  admin_name: "Ruitao Yuan",
  admin_email: "ryua7873@uni.sydney.edu.au",
};

const employeeNames = [
  "Ava Patel", "Leo Martin", "Sofia Nguyen", "Noah Brown", "Emily Wilson",
  "Jack Lee", "Olivia Garcia", "Ethan Moore", "Grace Taylor", "Daniel Kim",
  "Isabella White", "Will Harris", "Mia Clark", "Lucas Young", "Amelia Scott",
  "Henry Adams", "Charlotte Baker", "James Nelson", "Harper Green", "Mason Carter",
  "Ella Mitchell", "Benjamin Turner", "Chloe Phillips", "Liam Evans", "Zoe Campbell",
  "Oscar Roberts", "Ruby Edwards", "Aria Collins", "Max Cooper", "Lily Stewart",
  "Finn Morris", "Ivy Rogers", "Archie Reed", "Sienna Cook", "Hugo Morgan",
  "Evie Bell", "Kai Murphy", "Maya Bailey", "Theo Cox", "Nora Ward",
  "Jasper Gray", "Freya Kelly", "Aiden Price", "Alice Wood", "Caleb Hughes",
  "Poppy Watson", "Owen Bennett", "Layla Russell", "Felix Brooks", "Hannah Foster",
];

function teamNameFor(index: number) {
  if (index < 12) return "Operations";
  if (index < 23) return "Engineering";
  if (index < 33) return "Sales";
  if (index < 42) return "People";
  return "Customer Success";
}

function createSeedEmployee(fullName: string, index: number): CorporatePatient {
  const id = index + 1;
  const slug = fullName.toLowerCase().replace(/ /g, ".");
  const inviteStatus = id % 7 === 0 ? "invited" : id % 5 === 0 ? "opened" : "continued_to_vively";
  const baselineStatus = id <= 34 ? "completed" : id <= 42 ? "booked" : "not_started";
  const isLinked = inviteStatus === "continued_to_vively" || id % 4 === 0;
  const invitedDay = String(2 + (index % 25)).padStart(2, "0");
  const openedAt = inviteStatus === "invited" ? null : `2026-06-${invitedDay}T11:30:00Z`;

  return {
    id,
    corporate_account_id: corporateAccountMock.id,
    email: `${slug}@northstar.example`,
    full_name: fullName,
    team_name: teamNameFor(index),
    has_medicare: id % 6 !== 0,
    invite_token: `inv_${slug.replace(/\./g, "_")}`,
    invite_status: inviteStatus,
    signup_match_status: isLinked ? "found" : "not_found",
    vively_user_id: isLinked ? 5000 + id : null,
    vively_patient_id: isLinked ? 8000 + id : null,
    membership_status: baselineStatus === "completed" && id % 5 !== 0 ? "active" : "inactive",
    baseline_status: baselineStatus,
    invited_at: `2026-06-${invitedDay}T09:00:00Z`,
    email_sent_at: openedAt ? `2026-06-${invitedDay}T09:10:00Z` : null,
    opened_at: openedAt,
    signedup_at: isLinked ? `2026-06-${invitedDay}T14:20:00Z` : null,
  };
}

export const employeesMock: CorporatePatient[] = employeeNames.map(createSeedEmployee);
