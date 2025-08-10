import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data || 'An error occurred');
    return Promise.reject(error);
  }
);

export default apiClient;