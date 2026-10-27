
import axios from 'axios';

const TOKEN_KEY = 'libhub_token';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://libhub-xco8.onrender.com/api',

  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach JWT to every API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      'Could not reach LibHub. Check that the API server is running.';

    return Promise.reject(new Error(message));
  }
);

export { TOKEN_KEY };
