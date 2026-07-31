from __future__ import annotations

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from . import services
from .schemas import CreateMemberInviteInput, LoginInput, TeamInput


app = FastAPI(title="Vively Corporate Dashboard Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/v2/health")
def health_check():
    return {"data": {"ok": True}}


@app.post("/v2/login")
def login(input_data: LoginInput):
    return {
        "data": {
            "access_token": "prototype-token",
            "id": 501,
            "email": input_data.email,
            "first_name": "Ruitao",
            "last_name": "Yuan",
            "userable_type": "admins",
            "userable_id": 12,
        }
    }


@app.get("/v2/companies/{company}")
def get_company(company: int):
    return {"data": services.get_company()}


@app.get("/v2/companies/{company}/members")
def get_members(company: int):
    return {"data": services.get_members()}


@app.get("/v2/companies/{company}/teams")
def get_teams(company: int):
    return {"data": services.get_teams()}


@app.post("/v2/companies/{company}/teams", status_code=status.HTTP_201_CREATED)
def create_team(company: int, input_data: TeamInput):
    return {"data": services.create_team(input_data.name)}


@app.patch("/v2/companies/{company}/teams/{team}")
def rename_team(company: int, team: int, input_data: TeamInput):
    return {"data": services.rename_team(team, input_data.name)}


@app.delete("/v2/companies/{company}/teams/{team}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(company: int, team: int):
    services.delete_team(team)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/v2/companies/{company}/teams/{team}/members", status_code=status.HTTP_201_CREATED)
def create_member(company: int, team: int, input_data: CreateMemberInviteInput):
    return {"data": services.create_member_invite(team, input_data)}


@app.post("/v2/companies/{company}/members/{member}/invitation")
def send_member_invitation(company: int, member: int):
    return {"data": services.send_member_invitation(member)}


@app.delete("/v2/companies/{company}/members/{member}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(company: int, member: int):
    services.delete_member(member)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/v2/companies/{company}/activation-summary")
def activation_summary(company: int):
    return {"data": services.get_activation_summary()}


@app.get("/v2/companies/{company}/health-metrics")
def company_health_metrics(company: int):
    return {"data": services.get_health_metrics()}


@app.get("/v2/companies/{company}/teams/{team}/health-metrics")
def team_health_metrics(company: int, team: int):
    return {"data": services.get_health_metrics(team)}


@app.get("/v2/companies/{company}/billing")
def billing(company: int):
    return {"data": services.get_billing()}


@app.get("/v2/invitations/{token}")
def invitation(token: str):
    return {
        "data": {
            "company_name": services.get_company()["company_name"],
            "first_name": "",
            "last_name": "",
            "email": "",
            "invite_status": "opened",
        }
    }


@app.post("/v2/invitations/{token}/accept")
def accept_invitation(token: str):
    return {
        "data": {
            "company_name": services.get_company()["company_name"],
            "first_name": "",
            "last_name": "",
            "email": "",
            "invite_status": "continued_to_vively",
        }
    }


@app.options("/{path:path}")
def options_handler(path: str):
    return Response(status_code=status.HTTP_204_NO_CONTENT)
