import axios from 'axios';

const DEFAULT_API_ROOT = 'http://localhost:5001';

function normalizeApiBase(baseUrl, panelPath) {
  const trimmedBase = (baseUrl || '').trim().replace(/\/+$/, '');
  const normalizedPanelPath = panelPath.startsWith('/') ? panelPath : `/${panelPath}`;

  if (!trimmedBase) {
    return `${DEFAULT_API_ROOT}${normalizedPanelPath}`;
  }

  if (trimmedBase.endsWith(normalizedPanelPath)) {
    return trimmedBase;
  }

  return `${trimmedBase}${normalizedPanelPath}`;
}

const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL,
  '/api/master'
);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('erp_refresh_token');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('erp_access_token', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_refresh_token');
        localStorage.removeItem('erp_admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export { API_BASE };

export const createStudent = async (payload) => {
  const { data } = await api.post('/students', payload);
  return data;
};
