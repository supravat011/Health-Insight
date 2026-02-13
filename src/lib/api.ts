const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('access_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            };

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    error: data.error || 'Request failed',
                    message: data.message || response.statusText,
                };
            }

            return { data };
        } catch (error) {
            return {
                error: 'Network error',
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Auth endpoints
    async register(userData: {
        email: string;
        password: string;
        name: string;
        age?: number;
        gender?: string;
    }) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: { email: string; password: string }) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    // Profile endpoints
    async getProfile() {
        return this.request('/profile', {
            method: 'GET',
        });
    }

    async updateProfile(profileData: {
        name?: string;
        age?: number;
        gender?: string;
    }) {
        return this.request('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async getHealthHistory() {
        return this.request('/profile/history', {
            method: 'GET',
        });
    }

    // Health records endpoints
    async createHealthRecord(healthData: {
        height: number;
        weight: number;
        blood_pressure_systolic: number;
        blood_pressure_diastolic: number;
        blood_sugar: number;
        lifestyle_habits?: string;
    }) {
        return this.request('/health/record', {
            method: 'POST',
            body: JSON.stringify(healthData),
        });
    }

    async getHealthRecords(page = 1, perPage = 10) {
        return this.request(`/health/records?page=${page}&per_page=${perPage}`, {
            method: 'GET',
        });
    }

    async getHealthRecord(recordId: number) {
        return this.request(`/health/record/${recordId}`, {
            method: 'GET',
        });
    }

    // Prediction endpoints
    async createPrediction(healthRecordId: number) {
        return this.request('/predict', {
            method: 'POST',
            body: JSON.stringify({ health_record_id: healthRecordId }),
        });
    }

    async getPredictions(page = 1, perPage = 10) {
        return this.request(`/predictions?page=${page}&per_page=${perPage}`, {
            method: 'GET',
        });
    }

    async getPrediction(predictionId: number) {
        return this.request(`/prediction/${predictionId}`, {
            method: 'GET',
        });
    }

    // Dashboard endpoints
    async getDashboardStats() {
        return this.request('/dashboard/stats', {
            method: 'GET',
        });
    }

    async getDashboardTimeline() {
        return this.request('/dashboard/timeline', {
            method: 'GET',
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
