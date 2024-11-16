import apiClient from '../axios.js';

/**
 * 강의 관련 API 호출 모음
 * 강의 목록 조회, 상세 조회, 생성, 수정, 삭제 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const CourseAPI = {
  getUserCourse: async () => {
    try {
      const response = await apiClient.get('/api/courses/usercourses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCourseDetail: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course detail:', error);
      throw error;
    }
  },

  // 새로 추가되는 메서드들
  createCourse: async (instructorId, courseData) => {
    try {
      const response = await apiClient.post(`/api/courses?instructorId=${instructorId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (courseId, instructorId, courseData) => {
    try {
      const response = await apiClient.put(`/api/courses/${courseId}?instructorId=${instructorId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (courseId, instructorId) => {
    try {
      await apiClient.delete(`/api/courses/${courseId}?instructorId=${instructorId}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export default CourseAPI;
