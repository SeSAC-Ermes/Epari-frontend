// src/api/lecture/lectureApi.js
import axios from 'axios';
import { fetchAuthSession } from '@aws-amplify/auth';

const lectureApi = axios.create({
  baseURL: 'http://localhost:8080/api',
});

lectureApi.interceptors.request.use(
    async (config) => {
      try {
        const session = await fetchAuthSession();
        // tokens 객체에서 정확한 경로로 접근
        const token = session.tokens?.accessToken?.toString();

        if (!token) {
          throw new Error('No authentication token available');
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } catch (error) {
        console.error('Auth error:', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
);

export const LectureAPI = {
  getUserLectures: async () => {
    try {
      const response = await lectureApi.get('/lectures/userlectures');
      return response.data;
    } catch (error) {
      console.error('Error fetching lectures:', error);
      throw error;
    }
  },

  // 강의 상세 정보 조회 API 추가
  getLectureDetail: async (lectureId) => {
    try {
      const response = await lectureApi.get(`/lectures/${lectureId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lecture detail:', error);
      throw error;
    }
  },
  createLecture: async (lectureData) => {
    try {
      const response = await lectureApi.post('/lectures', lectureData);
      return response.data;
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw error;
    }
  },

  updateLecture: async (lectureId, lectureData) => {
    try {
      const response = await lectureApi.put(`/lectures/${lectureId}`, lectureData);
      return response.data;
    } catch (error) {
      console.error('Error updating lecture:', error);
      throw error;
    }
  },

  deleteLecture: async (lectureId) => {
    try {
      await lectureApi.delete(`/lectures/${lectureId}`);
    } catch (error) {
      console.error('Error deleting lecture:', error);
      throw error;
    }
  }
};
