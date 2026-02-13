import { apiClient } from './api';

export interface User {
    id: number;
    email: string;
    name: string;
    age?: number;
    gender?: string;
    created_at?: string;
}

export const auth = {
    // Store token and user data
    setToken(token: string) {
        localStorage.setItem('access_token', token);
    },

    // Get stored token
    getToken(): string | null {
        return localStorage.getItem('access_token');
    },

    // Remove token and user data
    clearAuth() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    // Store user data
    setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get stored user data
    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Login
    async login(email: string, password: string) {
        const response = await apiClient.login({ email, password });

        if (response.data) {
            this.setToken(response.data.access_token);
            this.setUser(response.data.user);
            return { success: true, user: response.data.user };
        }

        return { success: false, error: response.error, message: response.message };
    },

    // Register
    async register(userData: {
        email: string;
        password: string;
        name: string;
        age?: number;
        gender?: string;
    }) {
        const response = await apiClient.register(userData);

        if (response.data) {
            this.setToken(response.data.access_token);
            this.setUser(response.data.user);
            return { success: true, user: response.data.user };
        }

        return { success: false, error: response.error, message: response.message };
    },

    // Logout
    async logout() {
        await apiClient.logout();
        this.clearAuth();
    },
};
