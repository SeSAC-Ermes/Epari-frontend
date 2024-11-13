import apiClient from "../axios.js";

/**
 * 과제 관련 API 호출 모음
 * 과제 목록 조회, 상세 조회, 생성, 수정, 삭제 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const AssignmentAPI = {
  createAssignment: async (courseId, assignmentData, instructorId) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      const formattedDate = date.toISOString().split('.')[0];

      const requestData = {
        title: assignmentData.title,
        description: assignmentData.description,
        deadline: formattedDate,
      };

      const response = await apiClient.post(`/api/courses/${courseId}/assignments?instructorId=${instructorId}`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  uploadFiles: async (courseId, files, assignmentId) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (assignmentId) {
        formData.append('assignmentId', assignmentId);
      }

      const response = await apiClient.post(`/api/courses/${courseId}/assignments/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  getAssignments: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  getAssignmentById: async (courseId, assignmentId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  updateAssignment: async (courseId, assignmentId, assignmentData) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      const formattedDate = date.toISOString().split('.')[0];

      const response = await apiClient.put(`/api/courses/${courseId}/assignments/${assignmentId}`, {
        title: assignmentData.title,
        description: assignmentData.description,
        deadline: formattedDate,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  deleteAssignment: async (courseId, assignmentId) => {
    try {
      await apiClient.delete(`/api/courses/${courseId}/assignments/${assignmentId}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },

  searchAssignments: async (keyword) => {
    try {
      const response = await apiClient.get(`/api/assignments/search?title=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching assignments:', error);
      throw error;
    }
  },

  submitAssignment: async (courseId, assignmentId, submissionData) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/assignments/${assignmentId}/submission`,
          {
            content: submissionData.content,
            files: submissionData.files
          }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }
};
