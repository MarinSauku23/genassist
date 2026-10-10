from typing import Annotated, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

FEATURE_FLAG_KEY_PATTERN = r"^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)*$"
FeatureFlagKey = Annotated[str, StringConstraints(strip_whitespace=True, pattern=FEATURE_FLAG_KEY_PATTERN)]
FeatureFlagValue = Literal["true", "false"]

class FeatureFlagBase(BaseModel):
    key: str
    val: str
    description: Optional[str] = None
    is_active: int

class FeatureFlagCreate(FeatureFlagBase):
    key: FeatureFlagKey
    val: FeatureFlagValue
    is_active: int = Field(ge=0, le=1)

class FeatureFlagUpdate(BaseModel):
    key: Optional[FeatureFlagKey] = None
    val: Optional[FeatureFlagValue] = None
    description: Optional[str] = None
    is_active: Optional[int] = Field(None, ge=0, le=1)

class FeatureFlagRead(FeatureFlagBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
