import { Company, CorporateMember, CorporateTeam } from "../types/corporate";

export const companyMock: Company = {
  id: 1,
  company_name: "North Star Technologies",
  invite_code: "NORTHSTAR-2026",
  plan_price_cents: 29900,
  primary_admin: {
    first_name: "Ruitao",
    last_name: "Yuan",
    email: "ryua7873@uni.sydney.edu.au",
  },
  created_at: "2026-07-01T00:00:00+00:00",
};

const baseTeams: Omit<CorporateTeam, "member_count">[] = [
  { id: 1, name: "Operations", created_at: "2026-07-01T00:00:00+00:00" },
  { id: 2, name: "Engineering", created_at: "2026-07-01T00:00:00+00:00" },
  { id: 3, name: "Sales", created_at: "2026-07-01T00:00:00+00:00" },
  { id: 4, name: "People", created_at: "2026-07-01T00:00:00+00:00" },
  { id: 5, name: "Customer Success", created_at: "2026-07-01T00:00:00+00:00" },
];

const memberNames = [
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

function teamFor(index: number) {
  if (index < 12) return baseTeams[0];
  if (index < 23) return baseTeams[1];
  if (index < 33) return baseTeams[2];
  if (index < 42) return baseTeams[3];
  return baseTeams[4];
}

function teamWithCount(team: Omit<CorporateTeam, "member_count">): CorporateTeam {
  return {
    ...team,
    member_count: memberNames.filter((_, index) => teamFor(index).id === team.id).length,
  };
}

export const teamsMock: CorporateTeam[] = baseTeams.map(teamWithCount);

function splitName(fullName: string) {
  const [firstName, ...lastName] = fullName.split(" ");
  return { first_name: firstName, last_name: lastName.join(" ") };
}

function createSeedMember(fullName: string, index: number): CorporateMember {
  const id = index + 1;
  const slug = fullName.toLowerCase().replace(/ /g, ".");
  const inviteStatus = id % 7 === 0 ? "invited" : id % 5 === 0 ? "opened" : "continued_to_vively";
  const baselineStatus = id <= 34 ? "completed" : id <= 42 ? "booked" : "not_started";
  const isLinked = inviteStatus === "continued_to_vively" || id % 4 === 0;
  const invitedDay = String(2 + (index % 25)).padStart(2, "0");
  const openedAt = inviteStatus === "invited" ? null : `2026-06-${invitedDay}T11:30:00Z`;

  return {
    id,
    email: `${slug}@northstar.example`,
    ...splitName(fullName),
    team: teamWithCount(teamFor(index)),
    has_medicare: id % 6 !== 0,
    invite_status: inviteStatus,
    signup_match_status: isLinked ? "found" : "not_found",
    membership_status: baselineStatus === "completed" && id % 5 !== 0 ? "active" : "inactive",
    baseline_status: baselineStatus,
    invited_at: `2026-06-${invitedDay}T09:00:00Z`,
    email_sent_at: openedAt ? `2026-06-${invitedDay}T09:10:00Z` : null,
    opened_at: openedAt,
    signedup_at: isLinked ? `2026-06-${invitedDay}T14:20:00Z` : null,
    removed_at: null,
    created_at: `2026-06-${invitedDay}T09:00:00Z`,
  };
}

export const membersMock: CorporateMember[] = memberNames.map(createSeedMember);
