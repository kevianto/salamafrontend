const API_BASE_URL = 'https://salama-pmmp.onrender.com';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(data: any) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async triggerAnalysis() {
    const response = await fetch(`${API_BASE_URL}/sensors/sensor/analyze`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger analysis');
    }

    return response.json();
  }
}

export const apiService = new ApiService();