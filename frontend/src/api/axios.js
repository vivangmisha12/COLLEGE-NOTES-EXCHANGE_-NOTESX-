import axios from 'axios';

const api = axios.create({
 baseURL: "https://college-notes-exchange-notesx.onrender.com/api",
 withCredentials: false,
});

/* ✅ ATTACH TOKEN TO EVERY REQUEST */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
