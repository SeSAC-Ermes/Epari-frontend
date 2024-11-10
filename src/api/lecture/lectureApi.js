import apiClient from '../axios.js';

/**
 * 강의 관련 API 호출 모음
 * 강의 목록 조회, 상세 조회, 생성, 수정, 삭제 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const LectureAPI = {
  getUserLectures: async () => {
    try {
      const response = await apiClient.get('/api/courses/usercourses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getLectureDetail: async (lectureId) => {
    try {
      const response = await apiClient.get(`/api/courses/${lectureId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course detail:', error);
      throw error;
    }
  },

  createLecture: async (lectureData, instructorId) => {
    try {
      const response = await apiClient.post(`/api/courses?instructorId=${instructorId}`, lectureData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateLecture: async (lectureId, lectureData, instructorId) => {
    try {
      const response = await apiClient.put(`/api/courses/${lectureId}?instructorId=${instructorId}`, lectureData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteLecture: async (lectureId, instructorId) => {
    try {
      await apiClient.delete(`/api/courses/${lectureId}?instructorId=${instructorId}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};
