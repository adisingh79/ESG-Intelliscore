from django.urls import path

from .views import (
    CompanyDetailView,
    CompanyListView,
    CompanyReportView,
    ESGPredictView,
    NewsListView,
    UploadPageView,
    UploadZipView,
)


urlpatterns = [
    path("upload-zip/", UploadZipView.as_view(), name="upload-zip"),
    path("companies/", CompanyListView.as_view(), name="company-list"),
    path("companies/<int:pk>/", CompanyDetailView.as_view(), name="company-detail"),
    path("news/", NewsListView.as_view(), name="news-list"),
    path("reports/<str:company>/", CompanyReportView.as_view(), name="company-report"),
    path("predict/", ESGPredictView.as_view(), name="esg-predict"),
    path("upload-page/", UploadPageView.as_view(), name="upload-page"),
]

