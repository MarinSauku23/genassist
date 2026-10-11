"""Unit tests for the feature flag request bodies"""

import pytest
from pydantic import ValidationError

from app.schemas.feature_flag import FeatureFlagCreate, FeatureFlagUpdate

VALID_FLAG = {"key": "ui.menu", "val": "true", "description": "A test flag", "is_active": 1}


@pytest.mark.parametrize(
    "overrides",
    [
        {"val": "True"},
        {"val": "on"},
        {"val": ""},
        {"key": "my flag"},
        {"key": "ui_menu"},
        {"key": "ui."},
        {"key": ".ui"},
        {"key": "ui..menu"},
        {"key": "🚀"},
        {"is_active": 2},
        {"is_active": -1},
    ],
)
def test_create_rejects_values_the_ui_would_silently_ignore(overrides):
    with pytest.raises(ValidationError):
        FeatureFlagCreate(**{**VALID_FLAG, **overrides})


@pytest.mark.parametrize(
    "key, stored",
    [
        ("ui.menu", "ui.menu"),
        ("analytics.showCostPerConversation", "analytics.showCostPerConversation"),
        ("  ui.menu  ", "ui.menu"),
    ],
)
def test_create_accepts_dotted_keys_and_strips_whitespace(key, stored):
    assert FeatureFlagCreate(**{**VALID_FLAG, "key": key}).key == stored


@pytest.mark.parametrize("update", [{"val": "True"}, {"is_active": 2}])
def test_update_rejects_values_the_ui_would_silently_ignore(update):
    with pytest.raises(ValidationError):
        FeatureFlagUpdate(**update)
