import apiClient from "../axios.js";

/**
 * 과제 제출 관련 API 호출 모음
 * 과제 제출, 조회, 수정, 삭제 및 파일 다운로드 등의
 * API 요청 함수들을 제공하는 모듈
 */

export const SubmissionApi = {
  // 과제 제출
  createSubmission: async (courseId, assignmentId, submissionData) => {
    try {
      const formData = new FormData();

      // 파일 추가
      if (submissionData.files && submissionData.files.length > 0) {
        submissionData.files.forEach((file) => {
          formData.append('files', file);
        });
      }

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
      console.error('Error creating submission:', error);
      throw error;
    }
  },

  // 과제 제출 상세 조회
  getSubmissionById: async (courseId, assignmentId, submissionId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching submission:', error);
      throw error;
    }
  },

  // 과제 제출 수정
  updateSubmission: async (courseId, assignmentId, submissionId, submissionData) => {
    try {
      const formData = new FormData();

      // 파일 추가
      if (submissionData.files && submissionData.files.length > 0) {
        submissionData.files.forEach((file) => {
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
      console.error('Error updating submission:', error);
      throw error;
    }
  },

  // 과제 채점
  gradeSubmission: async (courseId, assignmentId, submissionId, gradeData) => {
    try {
      const response = await apiClient.put(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
          {
            grade: gradeData.grade,
            feedback: gradeData.feedback
          }
      );

      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  },

  // 과제 제출 삭제
  deleteSubmission: async (courseId, assignmentId, submissionId) => {
    try {
      await apiClient.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`
      );
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  },

  // 제출 파일 다운로드
  downloadSubmissionFile: async (courseId, assignmentId, submissionId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}/download`
      );
      return response.data; // presigned URL 반환
    } catch (error) {
      console.error('Error downloading submission file:', error);
      throw error;
    }
  },

  // 제출 파일 삭제
  deleteSubmissionFile: async (courseId, assignmentId, submissionId, fileId) => {
    try {
      const response = await apiClient.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting submission file:', error);
      throw error;
    }
  }
};
