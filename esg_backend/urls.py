from django.contrib import admin
from django.urls import include, path

from esg.views import UploadPageView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("esg.urls")),
    # Temporary demo frontend landing page
    path("", UploadPageView.as_view(), name="root-upload-page"),
]

