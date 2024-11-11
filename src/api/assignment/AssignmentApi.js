import apiClient from "../axios.js";

/**
 * 과제 관련 API 호출 모음
 * 과제 목록 조회, 상세 조회, 생성, 수정, 삭제 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const AssignmentAPI = {
  createAssignment: async (courseid, assignmentData) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      const formattedDate = date.toISOString().split('.')[0];

      const requestData = {
        courseid: courseid,
        title: assignmentData.title,
        description: assignmentData.description,
        deadline: formattedDate,
      };

      const response = await apiClient.post(`/api/courses/${courseid}/assignments`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  uploadFiles: async (courseid, files, assignmentid) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (assignmentid) {
        formData.append('assignmentid', assignmentid);
      }

      const response = await apiClient.post(`/api/courses/${courseid}/assignments/files`, formData, {
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

  getAssignments: async (courseid) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseid}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  getAssignmentById: async (courseid, assignmentid) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseid}/assignments/${assignmentid}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  updateAssignment: async (courseid, assignmentid, assignmentData) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);
      const formattedDate = date.toISOString().split('.')[0];

      const response = await apiClient.put(`/api/courses/${courseid}/assignments/${assignmentid}`, {
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

  deleteAssignment: async (courseid, assignmentid) => {
    try {
      await apiClient.delete(`/api/courses/${courseid}/assignments/${assignmentid}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  }
};
