import apiClient from '../axios';

export const CourseFileAPI = {

  // 강의 자료 업로드
  uploadCourseFile: async (courseId, formData) => {
    try {
      const response = await apiClient.post(`/api/courses/${courseId}/contents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading course file:', error);
      throw error;
    }
  },

  // 강의 자료 목록 조회
  getCourseFiles: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/contents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course files:', error);
      throw error;
    }
  },

  // 강의 자료 삭제
  deleteCourseFile: async (courseId, contentId) => {
    try {
      await apiClient.delete(`/api/courses/${courseId}/contents/${contentId}`);
    } catch (error) {
      console.error('Error deleting course file:', error);
      throw error;
    }
  },

  // 강의 자료 상세 조회
  getCourseFileDetail: async (courseId, contentId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/contents/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course file detail:', error);
      throw error;
    }
  },
  downloadFile: async (courseId, contentId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/contents/${contentId}/files/${fileId}/download`,
          {
            responseType: 'blob',  // 파일 데이터를 blob으로 받기
            headers: {
              'Accept': '*/*'
            }
          }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  // 여러 파일 다운로드 메서드 수정
  downloadMultipleFiles: async (courseId, contentId, files) => {
    try {
      const downloadPromises = files.map(file =>
          CourseFileAPI.downloadFile(courseId, contentId, file.id)
      );
      return await Promise.all(downloadPromises);
    } catch (error) {
      console.error('Error downloading multiple files:', error);
      throw error;
    }
  },

  getFileDownloadUrl: async (courseId, contentId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/contents/${contentId}/files/${fileId}/download`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      throw error;
    }
  },

  // 강의 자료 수정
  updateCourseFile: async (courseId, contentId, formData) => {
    try {
      const response = await apiClient.put(
          `/api/courses/${courseId}/contents/${contentId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating course file:', error);
      throw error;
    }
  },

  // 파일 업로드 (새로운 메서드)
  uploadFiles: async (courseId, contentId, files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient.post(
          `/api/courses/${courseId}/contents/${contentId}/files`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  // 파일 삭제 (새로운 메서드)
  deleteFile: async (courseId, contentId, fileId) => {
    try {
      await apiClient.delete(
          `/api/courses/${courseId}/contents/${contentId}/files/${fileId}`
      );
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // 자료실용 새로운 메서드 추가
  getCourseFileArchive: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/files/archive`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course file archive:', error);
      throw error;
    }
  },

  // 오늘의 강의 자료 조회
  getTodayFiles: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/contents/today`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today files:', error);
      throw error;
    }
  }
};


export default CourseFileAPI;
