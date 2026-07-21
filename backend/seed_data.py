from __future__ import annotations


corporate_account = {
    "id": 1,
    "company_name": "North Star Technologies",
    "invite_code": "NORTHSTAR-2026",
    "plan_price_cents": 29900,
    "admin_name": "Ruitao Yuan",
    "admin_email": "ryua7873@uni.sydney.edu.au",
}


def employee(
    employee_id,
    email,
    full_name,
    team_name,
    has_medicare,
    invite_status,
    signup_match_status,
    user_id,
    patient_id,
    membership_status,
    baseline_status,
    invited_at,
    opened_at,
    signedup_at,
):
    return {
        "id": employee_id,
        "corporate_account_id": 1,
        "email": email,
        "full_name": full_name,
        "team_name": team_name,
        "has_medicare": has_medicare,
        "invite_token": f"inv_{full_name.lower().replace(' ', '_')}",
        "invite_status": invite_status,
        "signup_match_status": signup_match_status,
        "vively_user_id": user_id,
        "vively_patient_id": patient_id,
        "membership_status": membership_status,
        "baseline_status": baseline_status,
        "invited_at": invited_at,
        "email_sent_at": invited_at if opened_at else None,
        "opened_at": opened_at,
        "signedup_at": signedup_at,
    }


employee_names = [
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


def team_name_for(index):
    if index < 12:
        return "Operations"
    if index < 23:
        return "Engineering"
    if index < 33:
        return "Sales"
    if index < 42:
        return "People"
    return "Customer Success"


def create_seed_employee(full_name, index):
    employee_id = index + 1
    slug = full_name.lower().replace(" ", ".")
    invite_status = (
        "invited"
        if employee_id % 7 == 0
        else "opened"
        if employee_id % 5 == 0
        else "continued_to_vively"
    )
    baseline_status = (
        "completed"
        if employee_id <= 34
        else "booked"
        if employee_id <= 42
        else "not_started"
    )
    is_linked = invite_status == "continued_to_vively" or employee_id % 4 == 0
    invited_day = str(2 + (index % 25)).zfill(2)
    opened_at = None if invite_status == "invited" else f"2026-06-{invited_day}T11:30:00Z"

    return employee(
        employee_id,
        f"{slug}@northstar.example",
        full_name,
        team_name_for(index),
        employee_id % 6 != 0,
        invite_status,
        "found" if is_linked else "not_found",
        5000 + employee_id if is_linked else None,
        8000 + employee_id if is_linked else None,
        "active" if baseline_status == "completed" and employee_id % 5 != 0 else "inactive",
        baseline_status,
        f"2026-06-{invited_day}T09:00:00Z",
        opened_at,
        f"2026-06-{invited_day}T14:20:00Z" if is_linked else None,
    )


employees_seed = [create_seed_employee(name, index) for index, name in enumerate(employee_names)]


billing_charges = [
    {"id": 1, "corporate_account_id": 1, "period": "July 2026", "amount_cents": 1495000, "employee_count": 50, "charge_type": "annual_membership", "status": "pending", "charged_at": None},
    {"id": 2, "corporate_account_id": 1, "period": "June 2026", "amount_cents": 1375400, "employee_count": 46, "charge_type": "annual_membership", "status": "charged", "charged_at": "2026-06-30T23:30:00Z"},
    {"id": 3, "corporate_account_id": 1, "period": "June 2026", "amount_cents": 24000, "employee_count": 8, "charge_type": "test_surcharge", "status": "charged", "charged_at": "2026-06-18T03:10:00Z"},
    {"id": 4, "corporate_account_id": 1, "period": "May 2026", "amount_cents": 1196000, "employee_count": 40, "charge_type": "annual_membership", "status": "charged", "charged_at": "2026-05-31T23:30:00Z"},
]


health_metrics = [
    {
        "team": "All Teams",
        "cohort_size": 50,
        "optimal_biomarker_percentage": 54,
        "in_range_biomarker_percentage": 31,
        "needs_attention_percentage": 15,
        "category_distribution": [
            {"category": "Aging", "optimal": 57, "in_range": 30, "needs_attention": 13},
            {"category": "Metabolic", "optimal": 56, "in_range": 31, "needs_attention": 13},
            {"category": "Heart", "optimal": 61, "in_range": 28, "needs_attention": 11},
            {"category": "Liver", "optimal": 68, "in_range": 24, "needs_attention": 8},
            {"category": "Nutrients", "optimal": 44, "in_range": 38, "needs_attention": 18},
            {"category": "Kidney", "optimal": 72, "in_range": 22, "needs_attention": 6},
            {"category": "Hormones", "optimal": 49, "in_range": 34, "needs_attention": 17},
            {"category": "Immunity", "optimal": 63, "in_range": 29, "needs_attention": 8},
            {"category": "Inflammation", "optimal": 52, "in_range": 30, "needs_attention": 18},
            {"category": "Blood", "optimal": 66, "in_range": 27, "needs_attention": 7},
        ],
    },
    {
        "team": "Operations",
        "cohort_size": 12,
        "optimal_biomarker_percentage": 49,
        "in_range_biomarker_percentage": 34,
        "needs_attention_percentage": 17,
        "category_distribution": [
            {"category": "Aging", "optimal": 51, "in_range": 31, "needs_attention": 18},
            {"category": "Metabolic", "optimal": 53, "in_range": 33, "needs_attention": 14},
            {"category": "Heart", "optimal": 47, "in_range": 35, "needs_attention": 18},
            {"category": "Liver", "optimal": 57, "in_range": 31, "needs_attention": 12},
            {"category": "Nutrients", "optimal": 42, "in_range": 37, "needs_attention": 21},
            {"category": "Kidney", "optimal": 69, "in_range": 23, "needs_attention": 8},
            {"category": "Hormones", "optimal": 46, "in_range": 35, "needs_attention": 19},
            {"category": "Immunity", "optimal": 58, "in_range": 30, "needs_attention": 12},
            {"category": "Inflammation", "optimal": 49, "in_range": 32, "needs_attention": 19},
            {"category": "Blood", "optimal": 61, "in_range": 28, "needs_attention": 11},
        ],
    },
    {
        "team": "Engineering",
        "cohort_size": 11,
        "optimal_biomarker_percentage": 58,
        "in_range_biomarker_percentage": 30,
        "needs_attention_percentage": 12,
        "category_distribution": [
            {"category": "Aging", "optimal": 60, "in_range": 27, "needs_attention": 13},
            {"category": "Metabolic", "optimal": 61, "in_range": 28, "needs_attention": 11},
            {"category": "Heart", "optimal": 55, "in_range": 31, "needs_attention": 14},
            {"category": "Liver", "optimal": 64, "in_range": 27, "needs_attention": 9},
            {"category": "Nutrients", "optimal": 50, "in_range": 34, "needs_attention": 16},
            {"category": "Kidney", "optimal": 74, "in_range": 20, "needs_attention": 6},
            {"category": "Hormones", "optimal": 54, "in_range": 33, "needs_attention": 13},
            {"category": "Immunity", "optimal": 67, "in_range": 25, "needs_attention": 8},
            {"category": "Inflammation", "optimal": 57, "in_range": 29, "needs_attention": 14},
            {"category": "Blood", "optimal": 69, "in_range": 24, "needs_attention": 7},
        ],
    },
    {
        "team": "Sales",
        "cohort_size": 10,
        "optimal_biomarker_percentage": 48,
        "in_range_biomarker_percentage": 35,
        "needs_attention_percentage": 17,
        "category_distribution": [
            {"category": "Aging", "optimal": 52, "in_range": 32, "needs_attention": 16},
            {"category": "Metabolic", "optimal": 49, "in_range": 34, "needs_attention": 17},
            {"category": "Heart", "optimal": 55, "in_range": 31, "needs_attention": 14},
            {"category": "Liver", "optimal": 60, "in_range": 29, "needs_attention": 11},
            {"category": "Nutrients", "optimal": 39, "in_range": 39, "needs_attention": 22},
            {"category": "Kidney", "optimal": 66, "in_range": 24, "needs_attention": 10},
            {"category": "Hormones", "optimal": 44, "in_range": 36, "needs_attention": 20},
            {"category": "Immunity", "optimal": 58, "in_range": 29, "needs_attention": 13},
            {"category": "Inflammation", "optimal": 46, "in_range": 34, "needs_attention": 20},
            {"category": "Blood", "optimal": 62, "in_range": 28, "needs_attention": 10},
        ],
    },
    {"team": "People", "cohort_size": 9, "optimal_biomarker_percentage": 53, "in_range_biomarker_percentage": 32, "needs_attention_percentage": 15, "category_distribution": []},
    {"team": "Customer Success", "cohort_size": 8, "optimal_biomarker_percentage": 51, "in_range_biomarker_percentage": 33, "needs_attention_percentage": 16, "category_distribution": []},
]
