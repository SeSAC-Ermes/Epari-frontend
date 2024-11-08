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
    (config) => {
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
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 인증 에러 처리
            localStorage.removeItem('token');
            // 필요한 경우 로그인 페이지로 리다이렉트
            break;
          case 403:
            // 권한 에러 처리
            break;
          default:
            // 기타 에러 처리
            break;
        }
      }
      return Promise.reject(error);
    }
);

export default apiClient;
