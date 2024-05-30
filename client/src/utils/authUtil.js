import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const removeToken = () => {
  localStorage.removeItem('token');
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { getToken, setToken, removeToken, axiosInstance };
