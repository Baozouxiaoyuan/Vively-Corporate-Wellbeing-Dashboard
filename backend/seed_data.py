company = {
    "id": 1,
    "company_name": "North Star Technologies",
    "invite_code": "NORTHSTAR-2026",
    "plan_price_cents": 29900,
    "primary_admin": {
        "first_name": "Ruitao",
        "last_name": "Yuan",
        "email": "ryua7873@uni.sydney.edu.au",
    },
    "created_at": "2026-07-01T00:00:00+00:00",
}

teams_seed = [
    {"id": 1, "name": "Operations", "created_at": "2026-07-01T00:00:00+00:00"},
    {"id": 2, "name": "Engineering", "created_at": "2026-07-01T00:00:00+00:00"},
    {"id": 3, "name": "Sales", "created_at": "2026-07-01T00:00:00+00:00"},
    {"id": 4, "name": "People", "created_at": "2026-07-01T00:00:00+00:00"},
    {"id": 5, "name": "Customer Success", "created_at": "2026-07-01T00:00:00+00:00"},
]

member_names = [
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
]


def team_for(index: int):
    if index < 12:
        return teams_seed[0]
    if index < 23:
        return teams_seed[1]
    if index < 33:
        return teams_seed[2]
    if index < 42:
        return teams_seed[3]
    return teams_seed[4]


def split_member_name(member_name: str):
    parts = member_name.split(" ")
    return parts[0], " ".join(parts[1:])


def create_member(member_name: str, index: int):
    member_id = index + 1
    first_name, last_name = split_member_name(member_name)
    slug = member_name.lower().replace(" ", ".")
    invite_status = "invited" if member_id % 7 == 0 else "opened" if member_id % 5 == 0 else "continued_to_vively"
    baseline_status = "completed" if member_id <= 34 else "booked" if member_id <= 42 else "not_started"
    is_linked = invite_status == "continued_to_vively" or member_id % 4 == 0
    invited_day = str(2 + (index % 25)).zfill(2)
    opened_at = None if invite_status == "invited" else f"2026-06-{invited_day}T11:30:00+00:00"

    return {
        "id": member_id,
        "email": f"{slug}@northstar.example",
        "first_name": first_name,
        "last_name": last_name,
        "team_id": team_for(index)["id"],
        "has_medicare": member_id % 6 != 0,
        "invite_status": invite_status,
        "signup_match_status": "found" if is_linked else "not_found",
        "membership_status": "active" if baseline_status == "completed" and member_id % 5 != 0 else "inactive",
        "baseline_status": baseline_status,
        "invited_at": f"2026-06-{invited_day}T09:00:00+00:00",
        "email_sent_at": f"2026-06-{invited_day}T09:10:00+00:00" if opened_at else None,
        "opened_at": opened_at,
        "signedup_at": f"2026-06-{invited_day}T14:20:00+00:00" if is_linked else None,
        "removed_at": None,
        "created_at": f"2026-06-{invited_day}T09:00:00+00:00",
    }


members_seed = [create_member(name, index) for index, name in enumerate(member_names)]

health_metrics = [
    {
        "scope": "company",
        "team_id": None,
        "cohort_size": 50,
        "below_privacy_threshold": False,
        "categories": [
            {"name": "Aging", "average_score": 57, "trend": "up", "optimal": 57, "in_range": 30, "needs_attention": 13},
            {"name": "Metabolic", "average_score": 56, "trend": "up", "optimal": 56, "in_range": 31, "needs_attention": 13},
            {"name": "Heart", "average_score": 61, "trend": "up", "optimal": 61, "in_range": 28, "needs_attention": 11},
            {"name": "Liver", "average_score": 68, "trend": "up", "optimal": 68, "in_range": 24, "needs_attention": 8},
            {"name": "Nutrients", "average_score": 44, "trend": "down", "optimal": 44, "in_range": 38, "needs_attention": 18},
            {"name": "Kidney", "average_score": 72, "trend": "up", "optimal": 72, "in_range": 22, "needs_attention": 6},
            {"name": "Hormones", "average_score": 49, "trend": "flat", "optimal": 49, "in_range": 34, "needs_attention": 17},
            {"name": "Immunity", "average_score": 63, "trend": "up", "optimal": 63, "in_range": 29, "needs_attention": 8},
            {"name": "Inflammation", "average_score": 52, "trend": "flat", "optimal": 52, "in_range": 30, "needs_attention": 18},
            {"name": "Blood", "average_score": 66, "trend": "up", "optimal": 66, "in_range": 27, "needs_attention": 7},
        ],
    },
    {
        "scope": "team",
        "team_id": 1,
        "cohort_size": 12,
        "below_privacy_threshold": False,
        "categories": [
            {"name": "Aging", "average_score": 51, "trend": "flat", "optimal": 51, "in_range": 31, "needs_attention": 18},
            {"name": "Metabolic", "average_score": 53, "trend": "flat", "optimal": 53, "in_range": 33, "needs_attention": 14},
            {"name": "Heart", "average_score": 47, "trend": "flat", "optimal": 47, "in_range": 35, "needs_attention": 18},
            {"name": "Liver", "average_score": 57, "trend": "up", "optimal": 57, "in_range": 31, "needs_attention": 12},
            {"name": "Nutrients", "average_score": 42, "trend": "down", "optimal": 42, "in_range": 37, "needs_attention": 21},
            {"name": "Kidney", "average_score": 69, "trend": "up", "optimal": 69, "in_range": 23, "needs_attention": 8},
            {"name": "Hormones", "average_score": 46, "trend": "flat", "optimal": 46, "in_range": 35, "needs_attention": 19},
            {"name": "Immunity", "average_score": 58, "trend": "up", "optimal": 58, "in_range": 30, "needs_attention": 12},
            {"name": "Inflammation", "average_score": 49, "trend": "flat", "optimal": 49, "in_range": 32, "needs_attention": 19},
            {"name": "Blood", "average_score": 61, "trend": "up", "optimal": 61, "in_range": 28, "needs_attention": 11},
        ],
    },
    {
        "scope": "team",
        "team_id": 2,
        "cohort_size": 11,
        "below_privacy_threshold": False,
        "categories": [
            {"name": "Aging", "average_score": 60, "trend": "up", "optimal": 60, "in_range": 27, "needs_attention": 13},
            {"name": "Metabolic", "average_score": 61, "trend": "up", "optimal": 61, "in_range": 28, "needs_attention": 11},
            {"name": "Heart", "average_score": 55, "trend": "up", "optimal": 55, "in_range": 31, "needs_attention": 14},
            {"name": "Liver", "average_score": 64, "trend": "up", "optimal": 64, "in_range": 27, "needs_attention": 9},
            {"name": "Nutrients", "average_score": 50, "trend": "flat", "optimal": 50, "in_range": 34, "needs_attention": 16},
            {"name": "Kidney", "average_score": 74, "trend": "up", "optimal": 74, "in_range": 20, "needs_attention": 6},
            {"name": "Hormones", "average_score": 54, "trend": "flat", "optimal": 54, "in_range": 33, "needs_attention": 13},
            {"name": "Immunity", "average_score": 67, "trend": "up", "optimal": 67, "in_range": 25, "needs_attention": 8},
            {"name": "Inflammation", "average_score": 57, "trend": "up", "optimal": 57, "in_range": 29, "needs_attention": 14},
            {"name": "Blood", "average_score": 69, "trend": "up", "optimal": 69, "in_range": 24, "needs_attention": 7},
        ],
    },
    {
        "scope": "team",
        "team_id": 3,
        "cohort_size": 10,
        "below_privacy_threshold": False,
        "categories": [
            {"name": "Aging", "average_score": 52, "trend": "flat", "optimal": 52, "in_range": 32, "needs_attention": 16},
            {"name": "Metabolic", "average_score": 49, "trend": "flat", "optimal": 49, "in_range": 34, "needs_attention": 17},
            {"name": "Heart", "average_score": 55, "trend": "up", "optimal": 55, "in_range": 31, "needs_attention": 14},
            {"name": "Liver", "average_score": 60, "trend": "up", "optimal": 60, "in_range": 29, "needs_attention": 11},
            {"name": "Nutrients", "average_score": 39, "trend": "down", "optimal": 39, "in_range": 39, "needs_attention": 22},
            {"name": "Kidney", "average_score": 66, "trend": "up", "optimal": 66, "in_range": 24, "needs_attention": 10},
            {"name": "Hormones", "average_score": 44, "trend": "down", "optimal": 44, "in_range": 36, "needs_attention": 20},
            {"name": "Immunity", "average_score": 58, "trend": "up", "optimal": 58, "in_range": 29, "needs_attention": 13},
            {"name": "Inflammation", "average_score": 46, "trend": "flat", "optimal": 46, "in_range": 34, "needs_attention": 20},
            {"name": "Blood", "average_score": 62, "trend": "up", "optimal": 62, "in_range": 28, "needs_attention": 10},
        ],
    },
    {"scope": "team", "team_id": 4, "cohort_size": 9, "below_privacy_threshold": True, "categories": None},
    {"scope": "team", "team_id": 5, "cohort_size": 8, "below_privacy_threshold": True, "categories": None},
]

billing_charges = [
    {"id": 1, "period": "2026-07", "amount_cents": 1495000, "employee_count": 50, "charge_type": "annual_membership", "status": "pending", "charged_at": None, "created_at": "2026-07-01T00:00:00+00:00"},
    {"id": 2, "period": "2026-06", "amount_cents": 1375400, "employee_count": 46, "charge_type": "annual_membership", "status": "charged", "charged_at": "2026-06-30T23:30:00+00:00", "created_at": "2026-06-01T00:00:00+00:00"},
    {"id": 3, "period": "2026-06", "amount_cents": 24000, "employee_count": 8, "charge_type": "test_surcharge", "status": "charged", "charged_at": "2026-06-18T03:10:00+00:00", "created_at": "2026-06-18T03:10:00+00:00"},
    {"id": 4, "period": "2026-05", "amount_cents": 1196000, "employee_count": 40, "charge_type": "annual_membership", "status": "charged", "charged_at": "2026-05-31T23:30:00+00:00", "created_at": "2026-05-01T00:00:00+00:00"},
]
