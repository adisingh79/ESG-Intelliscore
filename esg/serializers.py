from rest_framework import serializers

from .models import CompanyESG, CompanyReport, ESGNews


class CompanyESGSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyESG
        fields = [
            "id",
            "company",
            "sentiment_score",
            "environmental_score",
            "social_score",
            "governance_score",
            "esg_score",
            "created_at",
        ]


class CompanyESGListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyESG
        fields = [
            "id",
            "company",
            "esg_score",
            "environmental_score",
            "social_score",
            "governance_score",
            "sentiment_score",
        ]


class ESGNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESGNews
        fields = [
            "id",
            "title",
            "summary",
            "sentiment_score",
            "sentiment_label",
            "created_at",
        ]


class CompanyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyReport
        fields = ["id", "company", "report", "created_at"]


class ESGPredictRequestSerializer(serializers.Serializer):
    sentiment_score = serializers.FloatField()
    environmental_score = serializers.FloatField()
    social_score = serializers.FloatField()
    governance_score = serializers.FloatField()

