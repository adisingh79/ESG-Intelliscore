import apiClient from './config';

// Types
export interface CompanyESG {
    id: number;
    company: string;
    esg_score: number;
    environmental_score: number;
    social_score: number;
    governance_score: number;
    sentiment_score?: number;
    industry?: string;
    description?: string;
    created_at: string;
}

export interface ESGNews {
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
    report_data: any;
    created_at: string;
}

export interface PredictRequest {
    sentiment_score: number;
    environmental_score: number;
    social_score: number;
    governance_score: number;
}

export interface PredictResponse {
    predicted_esg_score: number;
}

export interface UploadResponse {
    status: string;
    companies_created?: number;
    news_created?: number;
    reports_created?: number;
    detail?: string;
}

// API Service Functions
export const esgService = {
    // Get all companies with latest ESG scores
    getCompanies: async (): Promise<CompanyESG[]> => {
        const response = await apiClient.get('/companies/');
        return response.data;
    },

    // Get specific company details
    getCompanyDetail: async (id: number): Promise<CompanyESG> => {
        const response = await apiClient.get(`/companies/${id}/`);
        return response.data;
    },

    // Get all ESG news
    getNews: async (): Promise<ESGNews[]> => {
        const response = await apiClient.get('/news/');
        return response.data;
    },

    // Get company report
    getCompanyReport: async (company: string): Promise<CompanyReport> => {
        const response = await apiClient.get(`/reports/${encodeURIComponent(company)}/`);
        return response.data;
    },

    // Predict ESG score
    predictESG: async (data: PredictRequest): Promise<PredictResponse> => {
        const response = await apiClient.post('/predict/', data);
        return response.data;
    },

    // Upload ZIP file
    uploadZip: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/upload-zip/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    },
};

export default esgService;
