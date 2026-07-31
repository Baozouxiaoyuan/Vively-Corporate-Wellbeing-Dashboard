from __future__ import annotations

from pydantic import BaseModel


class LoginInput(BaseModel):
    email: str
    password: str
    device: str | None = None


class TeamInput(BaseModel):
    name: str


class CreateMemberInviteInput(BaseModel):
    email: str
    first_name: str
    last_name: str
    has_medicare: bool = True
