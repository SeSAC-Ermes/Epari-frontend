import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

const BOARD_API_URL = 'https://1wem7asq9b.execute-api.ap-northeast-2.amazonaws.com';

const boardApiClient = axios.create({
  baseURL: BOARD_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Base64 URL 디코딩 함수
const base64UrlDecode = (str) => {
  // Base64 URL을 Base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 패딩 추가
  while (base64.length % 4) {
    base64 += '=';
  }
  // Base64 디코딩
  const decoded = atob(base64);

  // UTF-8로 변환
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
};

let cachedUserInfo = null;

export const clearUserCache = () => {
  cachedUserInfo = null;
};

// 사용자 정보를 가져오는 함수
export const getCurrentUser = async () => {
  try {
    const session = await fetchAuthSession();
    if (!session?.tokens?.idToken) {
      clearUserCache();
      throw new Error('No session available');
    }

    const idToken = session.tokens.idToken.toString();
    const parts = idToken.split('.');
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    // identities 필드를 통해 소셜 로그인 여부 확인
    const identities = payload.identities ? JSON.parse(payload.identities) : [];
    const isGoogleUser = identities.some(identity => identity.providerName === 'Google');

    let userData = {
      id: payload['cognito:username'],
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      loginType: isGoogleUser ? 'google' : 'email'  // 로그인 타입 추가
    };

    if (isGoogleUser) {
      // 구글 로그인 사용자의 경우
      userData = {
        ...userData,
        id: `google_${userData.id}`,
        picture: payload.picture || null
      };
    } else {
      // 일반 회원가입 사용자의 경우
      userData = {
        ...userData,
        picture: null  // 기본 프로필 이미지 사용
      };
    }

    cachedUserInfo = userData;
    return userData;

  } catch (error) {
    console.error('Error getting user info:', error);
    clearUserCache();
    return null;
  }
};

// Request interceptor
boardApiClient.interceptors.request.use(
    async (config) => {
      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
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

// Response interceptor
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
