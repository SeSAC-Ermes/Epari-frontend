import apiClient, { s3Client } from '../axios';

/**
 * 강의 자료 관련 API 호출 모음
 */

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
  getCourseFiles: async (courseId, cursorId, cursorDate) => {
    try {
      let url = `/api/courses/${courseId}/contents`;
      if (cursorId && cursorDate) {
        url += `?cursorId=${cursorId}&cursorDate=${cursorDate}`;
      }
      const response = await apiClient.get(url);
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

  // 강의 자료 검색 (커서 기반 페이징)
  searchCourseFiles: async (courseId, searchParams, cursorId, cursorDate) => {
    try {
      let url = `/api/courses/${courseId}/contents/search`;
      const params = new URLSearchParams();

      if (searchParams.title) params.append('title', searchParams.title);
      if (searchParams.content) params.append('content', searchParams.content);
      if (cursorId) params.append('cursorId', cursorId);
      if (cursorDate) params.append('cursorDate', cursorDate);

      const response = await apiClient.get(`${url}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching course files:', error);
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
  /**
   * S3에 저장된 파일을 다운로드합니다.
   * 처리 과정:
   * 1. 백엔드 API를 통해 S3 pre-signed URL을 받아옴
   * 2. pre-signed URL을 사용하여 S3에서 직접 파일을 다운로드
   * 3. 파일명을 추출하고 브라우저의 다운로드 기능을 실행
   */
  downloadFile: async (courseId, contentId, fileId, originalFileName) => {  // originalFileName 파라미터 추가
    try {
      // 1. presigned URL 받아오기
      const response = await apiClient.get(
          `/api/courses/${courseId}/contents/${contentId}/files/${fileId}/download`
      );
      const presignedUrl = response.data;

      // 2. S3에서 파일 다운로드
      const fileResponse = await s3Client.get(presignedUrl);

      // 3. 파일 다운로드 (원본 파일명 사용)
      const blob = new Blob([fileResponse.data], {
        type: fileResponse.headers['content-type'] || 'application/octet-stream'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalFileName;  // 원본 파일명 사용
      link.click();

      window.URL.revokeObjectURL(url);

      return fileResponse.data;
    } catch (error) {
      console.error('Error downloading file:', error);
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
