import logging
import pickle
from pathlib import Path
from typing import Any, Optional

from django.conf import settings


logger = logging.getLogger(__name__)


_MODEL: Optional[Any] = None


def _model_path() -> Path:
    """
    Return the expected path of the ESG model file.

    By default this is `<BASE_DIR>/models/esg_model.pkl`.
    """
    return Path(settings.BASE_DIR) / "models" / "esg_model.pkl"


def _load_model() -> Optional[Any]:
    """Load the ESG model from disk, logging but not raising on failure."""
    path = _model_path()

    if not path.exists():
        logger.error("ESG model file not found at %s", path)
        return None

    try:
        with path.open("rb") as f:
            model = pickle.load(f)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to load ESG model from %s: %s", path, exc)
        return None

    logger.info("ESG model successfully loaded from %s", path)
    return model


def get_esg_model() -> Optional[Any]:
    """
    Return the ESG model instance, loading it once on first access.

    Returns None if loading failed; callers should handle this case.
    """
    global _MODEL  # noqa: PLW0603

    if _MODEL is None:
        _MODEL = _load_model()
    return _MODEL

