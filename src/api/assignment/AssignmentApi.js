import apiClient from "../axios.js";

/**
 * 과제 관련 API 호출 모음
 * 과제 목록 조회, 상세 조회, 생성, 수정, 삭제 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const AssignmentAPI = {
  // 과제 생성
  createAssignment: async (courseId, assignmentData) => {
    try {
      const formData = new FormData();

      formData.append('title', assignmentData.title);
      formData.append('description', assignmentData.description);

      // 날짜 포맷팅
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      formData.append('deadline', date.toISOString().split('.')[0]);

      // 파일 추가
      if (assignmentData.files && assignmentData.files.length > 0) {
        assignmentData.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await apiClient.post(
          `/api/courses/${courseId}/assignments`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // 전체 과제 조회
  getAssignments: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // 과제 상세 조회
  getAssignmentById: async (courseId, assignmentId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  // 과제 수정
  updateAssignment: async (courseId, assignmentId, assignmentData) => {
    try {
      const formData = new FormData();

      formData.append('title', assignmentData.title);
      formData.append('description', assignmentData.description);

      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      const formattedDate = date.toISOString().split('.')[0];

      formData.append('deadline', formattedDate);

      if (assignmentData.files && assignmentData.files.length > 0) {
        assignmentData.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await apiClient.put(
          `/api/courses/${courseId}/assignments/${assignmentId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  // 과제 삭제
  deleteAssignment: async (courseId, assignmentId) => {
    try {
      await apiClient.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}`
      );
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  }
};
