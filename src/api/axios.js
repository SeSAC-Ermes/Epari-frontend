import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

/**
 * 전역적으로 사용될 Axios 인스턴스를 설정
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const session = await fetchAuthSession();
          const newToken = session.tokens?.accessToken?.toString();

          if (newToken) {
            localStorage.setItem('token', newToken);
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);

export default apiClient;
