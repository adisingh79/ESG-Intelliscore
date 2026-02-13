from typing import Any, Dict

from django.db.models import F
from django.http import Http404
from django.shortcuts import render
from django.views import View
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CompanyESG, CompanyReport, ESGNews
from .serializers import (
    CompanyESGListSerializer,
    CompanyESGSerializer,
    CompanyReportSerializer,
    ESGNewsSerializer,
    ESGPredictRequestSerializer,
)
from .services.model_loader import get_esg_model
from .services.zip_ingestion import IngestionError, ingest_zip_file


class UploadPageView(View):
    """Render a simple HTML page with a file input for ESG ZIP uploads."""

    def get(self, request, *args: Any, **kwargs: Any):
        return render(request, "esg/upload.html")


class UploadZipView(APIView):
    """
    Handle ESG data ZIP uploads.

    Expects multipart/form-data with a `file` field containing a ZIP archive.
    """

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        uploaded = request.FILES.get("file")
        if not uploaded:
            return Response(
                {"detail": "No file provided. Expected `file` field."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Basic content-type / extension validation
        filename = getattr(uploaded, "name", "")
        content_type = getattr(uploaded, "content_type", "")
        if not str(filename).lower().endswith(".zip") and "zip" not in content_type:
            return Response(
                {"detail": "Invalid file type. Only ZIP archives are supported."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ingestion_result = ingest_zip_file(uploaded)
        except IngestionError as exc:
            return Response(
                {"status": "error", "detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:  # noqa: BLE001
            # Generic catch-all to avoid leaking internal errors
            return Response(
                {
                    "status": "error",
                    "detail": "An unexpected error occurred while processing the ZIP file.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payload: Dict[str, Any] = {"status": "success"}
        payload.update(ingestion_result.to_dict())
        return Response(payload, status=status.HTTP_200_OK)


class CompanyListView(generics.ListAPIView):
    """
    List latest ESG scores for all companies.

    Uses PostgreSQL's DISTINCT ON to select the most recent record per company.
    """

    serializer_class = CompanyESGListSerializer

    def get_queryset(self):
        # Requires PostgreSQL in production, aligns with Neon requirement.
        # DISTINCT ON will keep the first row per company based on ordering.
        # We don't need an extra annotation named "esg_score" because the field
        # already exists on the model.
        return CompanyESG.objects.order_by("company", "-created_at").distinct("company")


class CompanyDetailView(generics.RetrieveAPIView):
    """Retrieve detailed ESG scores for a specific CompanyESG record."""

    queryset = CompanyESG.objects.all()
    serializer_class = CompanyESGSerializer


class NewsListView(generics.ListAPIView):
    """Return all ESG-related news sentiment entries."""

    queryset = ESGNews.objects.all()
    serializer_class = ESGNewsSerializer


class CompanyReportView(APIView):
    """Return the latest JSON report for a given company name."""

    def get(self, request: Request, company: str, *args: Any, **kwargs: Any) -> Response:
        qs = CompanyReport.objects.filter(company__iexact=company)
        report = qs.order_by("-created_at").first()
        if report is None:
            raise Http404("Report not found for the specified company.")

        serializer = CompanyReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ESGPredictView(APIView):
    """Predict ESG score using the pre-trained ML model."""

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = ESGPredictRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        model = get_esg_model()
        if model is None:
            return Response(
                {
                    "detail": "Prediction model is not available. "
                    "Ensure the `models/esg_model.pkl` file exists and is valid.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        data = serializer.validated_data
        features = [
            [
                data["sentiment_score"],
                data["environmental_score"],
                data["social_score"],
                data["governance_score"],
            ]
        ]

        try:
            prediction = model.predict(features)
            predicted_esg_score = float(prediction[0])
        except Exception:  # noqa: BLE001
            return Response(
                {
                    "detail": "Failed to generate prediction from the ESG model.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"predicted_esg_score": predicted_esg_score},
            status=status.HTTP_200_OK,
        )

