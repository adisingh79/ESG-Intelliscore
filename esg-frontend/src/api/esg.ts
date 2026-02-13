import { apiClient } from "./client";

export interface CompanySummary {
  id: number;
  company: string;
  esg_score: number;
}

export interface CompanyDetail extends CompanySummary {
  sentiment_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  created_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  created_at: string;
}

export interface CompanyReport {
  id: number;
  company: string;
  report: unknown;
  created_at: string;
}

export interface UploadSummary {
  status: string;
  companies_inserted: number;
  news_inserted: number;
  reports_inserted: number;
}

export interface PredictionRequest {
  sentiment_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
}

export interface PredictionResponse {
  predicted_esg_score: number;
}

export async function uploadZip(file: File): Promise<UploadSummary> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UploadSummary>("/upload-zip/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchCompanies(): Promise<CompanySummary[]> {
  const { data } = await apiClient.get<CompanySummary[]>("/companies/");
  return data;
}

export async function fetchCompany(id: number): Promise<CompanyDetail> {
  const { data } = await apiClient.get<CompanyDetail>(`/companies/${id}/`);
  return data;
}

export async function fetchNews(): Promise<NewsItem[]> {
  const { data } = await apiClient.get<NewsItem[]>("/news/");
  return data;
}

export async function fetchCompanyReport(
  company: string,
): Promise<CompanyReport> {
  const { data } = await apiClient.get<CompanyReport>(
    `/reports/${encodeURIComponent(company)}/`,
  );
  return data;
}

export async function predictEsqScore(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  const { data } = await apiClient.post<PredictionResponse>(
    "/predict/",
    payload,
  );
  return data;
}

