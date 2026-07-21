from __future__ import annotations

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from . import services
from .schemas import (
    ActivationSummary,
    BillingSummary,
    CorporateAccount,
    CorporateEmployee,
    CreateEmployeeInviteInput,
    DeleteResult,
    HealthMetricCohort,
    VivelyEmailResolverResult,
)


app = FastAPI(title="Vively Corporate Dashboard Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"ok": True}


@app.get("/api/corporate-account", response_model=CorporateAccount)
def corporate_account():
    return services.get_corporate_account()


@app.get("/api/employees", response_model=list[CorporateEmployee])
def employees():
    return services.get_employees()


@app.get("/api/teams", response_model=list[str])
def teams():
    return services.get_teams()


@app.post(
    "/api/employees/invite",
    response_model=CorporateEmployee,
    status_code=status.HTTP_201_CREATED,
)
def create_employee_invite(input_data: CreateEmployeeInviteInput):
    return services.create_invite(input_data)


@app.post("/api/employees/{employee_id}/send-invite", response_model=CorporateEmployee)
def send_employee_invite(employee_id: int):
    return services.send_invite_email(employee_id)


@app.delete("/api/employees/{employee_id}", response_model=DeleteResult)
def delete_employee(employee_id: int):
    return services.remove_employee(employee_id)


@app.get("/api/activation-summary", response_model=ActivationSummary)
def activation_summary():
    return services.get_activation_summary()


@app.get("/api/health-metrics", response_model=HealthMetricCohort)
def health_metrics(team: str = "All Teams"):
    return services.get_health_metrics(team)


@app.get("/api/billing-summary", response_model=BillingSummary)
def billing_summary():
    return services.get_billing_summary()


@app.get("/api/vively/resolve-user", response_model=VivelyEmailResolverResult)
def resolve_vively_user(email: str):
    return services.resolve_by_email(email)


@app.options("/{path:path}")
def options_handler(path: str):
    return Response(status_code=status.HTTP_204_NO_CONTENT)
