import axios from 'axios';

const useBackend = process.env.REACT_APP_USE_BACKEND_TMDB !== 'false';
const backendBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const tmdbClient = axios.create({
  baseURL: useBackend ? `${backendBase}/tmdb` : 'https://api.themoviedb.org/3',
  headers: useBackend || !process.env.REACT_APP_ACCESS_TOKEN
    ? undefined
    : { Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}` },
});

if (useBackend) {
  tmdbClient.interceptors.response.use((response) => {
    if (response?.data?.success && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
      response.data = response.data.data;
    }
    return response;
  });
}

export default tmdbClient;
