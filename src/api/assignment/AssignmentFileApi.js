import apiClient from "../axios.js";

export const AssignmentFileApi = {
  // 파일 다운로드 URL 조회
  getFileDownloadUrl: async (courseId, assignmentId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/files/${fileId}`
      );
      return response.data;  // 여기를 response.data로 수정
    } catch (error) {
      console.error('Error getting file download URL:', error);
      throw error;
    }
  },

  // 파일 삭제
  deleteFile: async (courseId, assignmentId, fileId) => {
    try {
      const response = await apiClient.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}/files/${fileId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
