import apiClient from '../axios';
import { downloadFileFromUrl } from "../../utils/FileDownloadUtils.js";

/**
 * 과제 제출 관련 API 호출 모음
 * API 요청 함수들을 제공하는 모듈
 */

export const SubmissionApi = {
  // 과제 제출
  createSubmission: async (courseId, assignmentId, formData) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    }
  },


  // 제출 수정
  updateSubmission: async (courseId, assignmentId, submissionId, submissionData) => {
    try {
      const formData = new FormData();
      formData.append('description', submissionData.description || '');

      if (submissionData.files && submissionData.files.length > 0) {
        submissionData.files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await apiClient.put(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  getSubmissionById: async (courseId, assignmentId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAllSubmissions: async (courseId, assignmentId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/list`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      throw error;
    }
  },

  gradeSubmission: async (courseId, assignmentId, submissionId, gradeData) => {
    try {
      const response = await apiClient.put(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
          gradeData
      );
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  },

  downloadSubmissionFile: async (courseId, assignmentId, submissionId, fileId, fileName) => {
    try {
      const { data: presignedUrl } = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}/download`
      );

      await downloadFileFromUrl(presignedUrl, fileName);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // 강의의 전체 과제 제출 현황 조회
  getCourseSubmissions: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course submissions:', error);
      throw error;
    }
  },
};
