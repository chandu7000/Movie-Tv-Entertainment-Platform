import axios from 'axios';

const TOKEN_KEY = 'cineverse_token';

const appApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

appApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

appApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && sessionStorage.getItem(TOKEN_KEY)) {
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('cineverse:session-expired'));
    }
    return Promise.reject(error);
  }
);

export default appApiClient;
