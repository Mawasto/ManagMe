const API_URL = 'http://localhost:4000/api/auth';

export const authApi = {
  login: async (login: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    if (!res.ok) return { error: 'Invalid credentials' };
    return await res.json();
  },

  refresh: async (refreshToken: string) => {
    const res = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return { error: 'Invalid refresh token' };
    return await res.json();
  },

  getCurrentUser: async (token: string) => {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { error: 'Invalid token' };
    return await res.json();
  },
};
