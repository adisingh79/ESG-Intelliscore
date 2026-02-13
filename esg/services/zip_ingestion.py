import json
import logging
import os
import zipfile
from dataclasses import dataclass
from pathlib import Path
from tempfile import NamedTemporaryFile, TemporaryDirectory
from typing import IO, Dict, Iterable, Tuple

import pandas as pd
from django.db import transaction

from esg.models import CompanyESG, CompanyReport, ESGNews


logger = logging.getLogger(__name__)


class IngestionError(Exception):
    """Raised when ZIP ingestion fails in a controlled way."""


@dataclass
class IngestionResult:
    companies_inserted: int = 0
    news_inserted: int = 0
    reports_inserted: int = 0

    def to_dict(self) -> Dict[str, int]:
        return {
            "companies_inserted": self.companies_inserted,
            "news_inserted": self.news_inserted,
            "reports_inserted": self.reports_inserted,
        }


def _save_uploaded_file(uploaded_file: IO[bytes]) -> Path:
    """
    Persist the uploaded file to a temporary file on disk and return its path.

    Supports both Django UploadedFile (with .chunks()) and generic file-like
    objects (with .read()).
    """
    tmp = NamedTemporaryFile(suffix=".zip", delete=False)
    try:
        if hasattr(uploaded_file, "chunks"):
            for chunk in uploaded_file.chunks():
                tmp.write(chunk)
        else:
            # Fallback for generic file-like objects
            data = uploaded_file.read()
            if isinstance(data, str):
                data = data.encode()
            tmp.write(data)
    finally:
        tmp.close()
    return Path(tmp.name)


def _detect_schema(df: pd.DataFrame) -> str:
    """
    Detect the logical schema of a CSV DataFrame.

    Returns one of:
    - "company_esg"
    - "news"
    - "" (unknown / unsupported)
    """
    lowered = {c.lower() for c in df.columns}

    if {"company", "sentiment_score"}.issubset(lowered):
        return "company_esg"

    if {"title", "sentiment_score"}.issubset(lowered):
        return "news"

    return ""


def _get_column(df: pd.DataFrame, *names: str, default=None):
    """Return a Series for the first matching column name (case-insensitive)."""
    lowered_map = {c.lower(): c for c in df.columns}
    for name in names:
        key = name.lower()
        if key in lowered_map:
            return df[lowered_map[key]]
    return default


def _iter_csv_files(root: Path) -> Iterable[Path]:
    for dirpath, _, filenames in os.walk(root):
        for filename in filenames:
            if filename.lower().endswith(".csv"):
                yield Path(dirpath) / filename


def _iter_json_files(root: Path) -> Iterable[Path]:
    for dirpath, _, filenames in os.walk(root):
        for filename in filenames:
            if filename.lower().endswith(".json"):
                yield Path(dirpath) / filename


def _parse_company_name_from_filename(path: Path) -> str:
    """
    Infer company name from filename, e.g.
    - 'TCS.json' -> 'TCS'
    - 'tcs_report.json' -> 'tcs_report' (caller can normalise further if needed)
    """
    return path.stem


def _ingest_company_esg(df: pd.DataFrame) -> int:
    """Create CompanyESG rows from a DataFrame."""
    df = df.copy()

    # Required fields
    company_series = _get_column(df, "company")
    sentiment_series = _get_column(df, "sentiment_score", "sentiment_score", "Sentiment_Score")

    if company_series is None or sentiment_series is None:
        logger.warning("CSV detected as company_esg but missing required columns.")
        return 0

    # Optional fields with sensible defaults
    environmental_series = _get_column(df, "environmental_score", "environmental", "env_score")
    social_series = _get_column(df, "social_score", "social", "soc_score")
    governance_series = _get_column(df, "governance_score", "governance", "gov_score")
    esg_series = _get_column(df, "esg_score", "esg")

    instances = []
    for idx in range(len(df)):
        try:
            company = str(company_series.iloc[idx]).strip()
            if not company:
                continue

            sentiment = float(sentiment_series.iloc[idx])

            environmental = float(environmental_series.iloc[idx]) if environmental_series is not None else 0.0
            social = float(social_series.iloc[idx]) if social_series is not None else 0.0
            governance = float(governance_series.iloc[idx]) if governance_series is not None else 0.0

            if esg_series is not None:
                esg_score = float(esg_series.iloc[idx])
            else:
                # Fallback: simple average of available components or sentiment score
                components = [environmental, social, governance]
                non_zero_components = [c for c in components if c != 0.0]
                if non_zero_components:
                    esg_score = sum(non_zero_components) / len(non_zero_components)
                else:
                    esg_score = sentiment

            instances.append(
                CompanyESG(
                    company=company,
                    sentiment_score=sentiment,
                    environmental_score=environmental,
                    social_score=social,
                    governance_score=governance,
                    esg_score=esg_score,
                )
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to parse CompanyESG row %s: %s", idx, exc)

    if not instances:
        return 0

    CompanyESG.objects.bulk_create(instances)
    return len(instances)


def _ingest_news(df: pd.DataFrame) -> int:
    """Create ESGNews rows from a DataFrame."""
    df = df.copy()

    title_series = _get_column(df, "title")
    summary_series = _get_column(df, "summary", "description", "body")
    sentiment_series = _get_column(df, "sentiment_score", "sentiment")
    label_series = _get_column(df, "sentiment_label", "label")

    if title_series is None or sentiment_series is None:
        logger.warning("CSV detected as news but missing required columns.")
        return 0

    instances = []
    for idx in range(len(df)):
        try:
            title = str(title_series.iloc[idx]).strip()
            if not title:
                continue

            summary = (
                str(summary_series.iloc[idx]).strip()
                if summary_series is not None
                else ""
            )
            sentiment = float(sentiment_series.iloc[idx])
            label = (
                str(label_series.iloc[idx]).strip()
                if label_series is not None
                else ""
            )

            instances.append(
                ESGNews(
                    title=title,
                    summary=summary,
                    sentiment_score=sentiment,
                    sentiment_label=label,
                )
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to parse ESGNews row %s: %s", idx, exc)

    if not instances:
        return 0

    ESGNews.objects.bulk_create(instances)
    return len(instances)


def _ingest_json_reports(root: Path) -> int:
    """Create CompanyReport rows for each JSON file found under root."""
    instances = []
    for path in _iter_json_files(root):
        try:
            with path.open("r", encoding="utf-8") as f:
                payload = json.load(f)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to parse JSON report %s: %s", path, exc)
            continue

        company = _parse_company_name_from_filename(path)
        instances.append(CompanyReport(company=company, report=payload))

    if not instances:
        return 0

    CompanyReport.objects.bulk_create(instances)
    return len(instances)


def _ingest_csvs(root: Path) -> Tuple[int, int]:
    """Process all CSVs, returning (companies_inserted, news_inserted)."""
    companies_inserted = 0
    news_inserted = 0

    for path in _iter_csv_files(root):
        try:
            df = pd.read_csv(path)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to read CSV %s: %s", path, exc)
            continue

        schema = _detect_schema(df)
        if schema == "company_esg":
            companies_inserted += _ingest_company_esg(df)
        elif schema == "news":
            news_inserted += _ingest_news(df)
        else:
            logger.info("Skipping unsupported CSV schema in %s", path)

    return companies_inserted, news_inserted


def ingest_zip_file(uploaded_file: IO[bytes]) -> IngestionResult:
    """
    Main ingestion entrypoint.

    1. Persist uploaded ZIP to disk.
    2. Extract into a temporary directory.
    3. Ingest CSV- and JSON-based ESG data.
    4. Clean up all temporary resources.
    """
    tmp_path = _save_uploaded_file(uploaded_file)

    if not zipfile.is_zipfile(tmp_path):
        try:
            os.remove(tmp_path)
        except OSError:
            logger.warning("Failed to delete invalid ZIP temp file %s", tmp_path)
        raise IngestionError("Uploaded file is not a valid ZIP archive.")

    result = IngestionResult()

    try:
        with TemporaryDirectory() as extract_dir:
            extract_root = Path(extract_dir)

            try:
                with zipfile.ZipFile(tmp_path, "r") as zf:
                    zf.extractall(extract_root)
            except zipfile.BadZipFile as exc:
                raise IngestionError("Could not read ZIP archive.") from exc

            with transaction.atomic():
                companies, news = _ingest_csvs(extract_root)
                reports = _ingest_json_reports(extract_root)

            result.companies_inserted = companies
            result.news_inserted = news
            result.reports_inserted = reports
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            logger.warning("Failed to delete temporary ZIP file %s", tmp_path)

    return result

