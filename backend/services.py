from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone

from fastapi import HTTPException

from .seed_data import billing_charges, company, health_metrics, members_seed, teams_seed


PRIVACY_THRESHOLD = 10

members = deepcopy(members_seed)
teams = deepcopy(teams_seed)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_company():
    return company


def team_member_count(team_id: int) -> int:
    return len([member for member in members if member["team_id"] == team_id])


def team_resource(team):
    return {
        "id": team["id"],
        "name": team["name"],
        "member_count": team_member_count(team["id"]),
        "created_at": team["created_at"],
    }


def get_teams():
    return [team_resource(team) for team in teams]


def find_team(team_id: int):
    found = next((team for team in teams if team["id"] == team_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Team not found")
    return team_resource(found)


def member_resource(member):
    return {
        "id": member["id"],
        "email": member["email"],
        "first_name": member["first_name"],
        "last_name": member["last_name"],
        "team": find_team(member["team_id"]),
        "has_medicare": member["has_medicare"],
        "invite_status": member["invite_status"],
        "signup_match_status": member["signup_match_status"],
        "membership_status": member["membership_status"],
        "baseline_status": member["baseline_status"],
        "invited_at": member["invited_at"],
        "email_sent_at": member["email_sent_at"],
        "opened_at": member["opened_at"],
        "signedup_at": member["signedup_at"],
        "removed_at": member["removed_at"],
        "created_at": member["created_at"],
    }


def get_members():
    return [member_resource(member) for member in members]


def create_team(name: str):
    if any(team["name"].lower() == name.lower() for team in teams):
        raise HTTPException(status_code=422, detail="Team already exists")

    created = {
        "id": max([team["id"] for team in teams], default=0) + 1,
        "name": name,
        "created_at": utc_now(),
    }
    teams.append(created)
    return team_resource(created)


def rename_team(team_id: int, name: str):
    for team in teams:
        if team["id"] == team_id:
            team["name"] = name
            return team_resource(team)
    raise HTTPException(status_code=404, detail="Team not found")


def delete_team(team_id: int):
    team = find_team(team_id)
    if team["member_count"] > 0:
        raise HTTPException(status_code=422, detail="Team still has members")

    teams[:] = [team for team in teams if team["id"] != team_id]


def create_member_invite(team_id: int, input_data):
    find_team(team_id)
    created = {
        "id": max([member["id"] for member in members], default=0) + 1,
        "email": input_data.email,
        "first_name": input_data.first_name,
        "last_name": input_data.last_name,
        "team_id": team_id,
        "has_medicare": input_data.has_medicare,
        "invite_status": "invited",
        "signup_match_status": "not_found",
        "membership_status": "inactive",
        "baseline_status": "not_started",
        "invited_at": utc_now(),
        "email_sent_at": None,
        "opened_at": None,
        "signedup_at": None,
        "removed_at": None,
        "created_at": utc_now(),
    }
    members.insert(0, created)
    return member_resource(created)


def send_member_invitation(member_id: int):
    found = next((member for member in members if member["id"] == member_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Member invite not found")

    found["email_sent_at"] = utc_now()
    return member_resource(found)


def delete_member(member_id: int):
    before = len(members)
    members[:] = [member for member in members if member["id"] != member_id]
    if len(members) == before:
        raise HTTPException(status_code=404, detail="Member not found")


def get_activation_summary():
    total = len(members) or 1
    opened = len([member for member in members if member["opened_at"]])
    continued = len([member for member in members if member["invite_status"] == "continued_to_vively"])
    active = len([member for member in members if member["membership_status"] == "active"])
    baseline = len([member for member in members if member["baseline_status"] == "completed"])

    return {
        "total_members": len(members),
        "funnel": {
            "invited": len(members),
            "opened": opened,
            "continued_to_vively": continued,
            "active": active,
            "baseline_completed": baseline,
        },
        "activation_rate": round(continued / total, 2),
    }


def get_health_metrics(team_id: int | None = None):
    if team_id is None:
        metric = next(item for item in health_metrics if item["scope"] == "company")
        team = None
    else:
        team = find_team(team_id)
        metric = next((item for item in health_metrics if item["team_id"] == team_id), None)
        if metric is None:
            cohort_size = team_member_count(team_id)
            metric = {
                "scope": "team",
                "team_id": team_id,
                "cohort_size": cohort_size,
                "below_privacy_threshold": cohort_size < PRIVACY_THRESHOLD,
                "categories": None,
            }

    below_threshold = metric["cohort_size"] < PRIVACY_THRESHOLD
    return {
        "scope": metric["scope"],
        "team": team,
        "cohort_size": metric["cohort_size"],
        "below_privacy_threshold": below_threshold,
        "categories": None if below_threshold else metric["categories"],
    }


def get_billing():
    current = billing_charges[0]
    return {
        "current_period": current["period"],
        "annual_membership": {
            "amount_cents": current["amount_cents"],
            "employee_count": current["employee_count"],
            "status": current["status"],
            "charged_at": current["charged_at"],
        },
        "charges": billing_charges,
    }
