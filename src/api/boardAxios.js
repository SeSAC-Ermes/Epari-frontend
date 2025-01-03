import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

const BOARD_API_URL = 'https://mrw10sc2ic.execute-api.ap-northeast-2.amazonaws.com';

const boardApiClient = axios.create({
  baseURL: BOARD_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
boardApiClient.interceptors.request.use(
    async (config) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Auth session error:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// 응답 인터셉터
boardApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const session = await fetchAuthSession();
          const newToken = session.tokens?.accessToken?.toString();

          if (newToken) {
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return boardApiClient(originalRequest);
          }
        } catch (refreshError) {
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);

export default boardApiClient;
