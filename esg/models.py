from django.db import models


class CompanyESG(models.Model):
    company = models.CharField(max_length=255)
    sentiment_score = models.FloatField()
    environmental_score = models.FloatField()
    social_score = models.FloatField()
    governance_score = models.FloatField()
    esg_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.company} ({self.esg_score})"


class ESGNews(models.Model):
    title = models.TextField()
    summary = models.TextField()
    sentiment_score = models.FloatField()
    sentiment_label = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title[:80]


class CompanyReport(models.Model):
    company = models.CharField(max_length=255)
    report = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Report for {self.company}"

