import apiClient from "../axios.js";

export const SubmissionFileApi = {
  // 파일 다운로드 URL 조회
  getFileDownloadUrl: async (courseId, assignmentId, submissionId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}/download`
      );
      return response.data; // presignedUrl이 직접 string으로 반환됨
    } catch (error) {
      console.error('Error getting submission file download URL:', error);
      throw error;
    }
  },

  // 파일 삭제
  deleteFile: async (courseId, assignmentId, submissionId, fileId) => {
    try {
      const response = await apiClient.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting submission file:', error);
      throw error;  // 여기서 에러를 던지고 있지만
    }
  }
};
