from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from .seed_data import billing_charges, corporate_account, employees_seed, health_metrics
from .schemas import CreateEmployeeInviteInput


PRIVACY_THRESHOLD = 10

employees = deepcopy(employees_seed)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def get_corporate_account():
    return corporate_account


def get_employees():
    return employees


def get_teams():
    team_names = []
    for item in employees:
        if item["team_name"] not in team_names:
            team_names.append(item["team_name"])
    return ["All Teams", *team_names]


def resolve_by_email(email: str):
    found = next(
        (
            item
            for item in employees
            if item["email"].lower() == email.lower()
            and item["signup_match_status"] == "found"
        ),
        None,
    )
    return {
        "exists": bool(found),
        "vively_user_id": found["vively_user_id"] if found else None,
        "vively_patient_id": found["vively_patient_id"] if found else None,
        "userable_type": "Patient" if found else None,
        "link_status": "patient_linked" if found else "not_found",
    }


def create_invite(input_data: CreateEmployeeInviteInput):
    resolver = resolve_by_email(input_data.email)
    next_id = max(item["id"] for item in employees) + 1 if employees else 1

    created = {
        "id": next_id,
        "corporate_account_id": corporate_account["id"],
        "email": input_data.email,
        "full_name": input_data.full_name,
        "team_name": input_data.team_name,
        "has_medicare": input_data.has_medicare,
        "invite_token": f"inv_{str(uuid4())[:8]}",
        "invite_status": "invited",
        "signup_match_status": "found" if resolver["exists"] else "not_found",
        "vively_user_id": resolver["vively_user_id"],
        "vively_patient_id": resolver["vively_patient_id"],
        "membership_status": "inactive",
        "baseline_status": "not_started",
        "invited_at": utc_now(),
        "email_sent_at": None,
        "opened_at": None,
        "signedup_at": None,
    }

    employees.insert(0, created)
    return created


def send_invite_email(employee_id: int):
    found = next((item for item in employees if item["id"] == employee_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Employee invite not found")

    found["email_sent_at"] = utc_now()
    return found


def remove_employee(employee_id: int):
    before = len(employees)
    employees[:] = [item for item in employees if item["id"] != employee_id]
    if len(employees) == before:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"ok": True}


def get_activation_summary():
    total = len(employees) or 1
    opened = len([item for item in employees if item["opened_at"]])
    continued = len([item for item in employees if item["invite_status"] == "continued_to_vively"])
    linked = len([item for item in employees if item["signup_match_status"] == "found"])
    baseline = len([item for item in employees if item["baseline_status"] == "completed"])
    active = len([item for item in employees if item["membership_status"] == "active"])

    return {
        "total_invited": len(employees),
        "opened_invites": opened,
        "continued_to_vively": continued,
        "linked_employees": linked,
        "baseline_completed": baseline,
        "active_memberships": active,
        "activation_rate": round((continued / total) * 100),
        "baseline_completion_rate": round((baseline / total) * 100),
        "membership_rate": round((active / total) * 100),
        "funnel": [
            {"stage": "Invited", "count": len(employees)},
            {"stage": "Opened", "count": opened},
            {"stage": "Continued", "count": continued},
            {"stage": "Linked", "count": linked},
            {"stage": "Baseline", "count": baseline},
        ],
    }


def get_health_metrics(team: str = "All Teams"):
    metrics = next((item for item in health_metrics if item["team"] == team), None)
    if metrics is None:
        cohort_size = len([item for item in employees if item["team_name"] == team])
        metrics = {
            "team": team,
            "cohort_size": cohort_size,
            "optimal_biomarker_percentage": 0,
            "in_range_biomarker_percentage": 0,
            "needs_attention_percentage": 0,
            "category_distribution": [],
        }
    if metrics["cohort_size"] < PRIVACY_THRESHOLD:
        return {**metrics, "category_distribution": []}
    return metrics


def get_billing_summary():
    current = billing_charges[0]
    return {
        "account": corporate_account,
        "current_period": current["period"],
        "employee_count": current["employee_count"],
        "current_amount_cents": current["amount_cents"],
        "current_status": current["status"],
        "history": billing_charges,
    }
