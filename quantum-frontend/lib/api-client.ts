/**
 * API client for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class APIClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
        // Try to load token from localStorage
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || 'Request failed');
        }

        return response.json();
    }

    // Authentication
    async login(email: string, password: string) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.access_token) {
            this.setToken(data.access_token);
        }
        return data;
    }

    async signup(name: string, email: string, password: string, role: string) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
        if (data.access_token) {
            this.setToken(data.access_token);
        }
        return data;
    }

    // Bot Management
    async startBot(platform: string, meetingUrl: string, language: string = 'en', botName: string = 'Quantum AI Bot') {
        return this.request('/bots/start', {
            method: 'POST',
            body: JSON.stringify({
                platform,
                meeting_url: meetingUrl,
                language,
                bot_name: botName,
            }),
        });
    }

    async stopBot(platform: string, meetingId: string) {
        return this.request('/bots/stop', {
            method: 'POST',
            body: JSON.stringify({
                platform,
                native_meeting_id: meetingId,
            }),
        });
    }

    async getBotStatus() {
        return this.request('/bots/status');
    }

    async updateBotLanguage(platform: string, meetingId: string, language: string) {
        return this.request(`/bots/${platform}/${meetingId}/language`, {
            method: 'PUT',
            body: JSON.stringify({ language }),
        });
    }

    // Meeting Management
    async listMeetings() {
        return this.request('/meetings/');
    }

    async getTranscript(platform: string, meetingId: string) {
        return this.request(`/meetings/${platform}/${meetingId}/transcript`);
    }

    async updateMeeting(
        platform: string,
        meetingId: string,
        data: {
            name?: string;
            participants?: string[];
            languages?: string[];
            notes?: string;
        }
    ) {
        return this.request(`/meetings/${platform}/${meetingId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteMeetingTranscripts(platform: string, meetingId: string) {
        return this.request(`/meetings/${platform}/${meetingId}`, {
            method: 'DELETE',
        });
    }
}

export const apiClient = new APIClient();
