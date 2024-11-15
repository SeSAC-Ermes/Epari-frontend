// import apiClient from './apiClient';
import apiClient from "../axios.js";

export const NoticeApi = {
  // 공지사항 생성
  createNotice: async (noticeData) => {
    const response = await apiClient.post('/api/notices', noticeData);
    return response.data;
  },

  // 단일 공지사항 조회
  getNotice: async (id) => {
    const response = await apiClient.get(`/api/notices/${id}`);
    return response.data;
  },


  // 공지사항 수정
  updateNotice: async (id, noticeData) => {
    const response = await apiClient.put(`/api/notices/${id}`, noticeData);
    return response.data;
  },

  // 공지사항 삭제
  deleteNotice: async (id) => {
    const response = await apiClient.delete(`/api/notices/${id}`);
    return response.data;
  },

  // 전체 공지사항 조회
  getGlobalNotices: async () => {
    const response = await apiClient.get('/api/notices/global');
    return response.data;
  },

  // 강의 공지사항 조회
  getCourseNotices: async (courseId) => {
    const response = await apiClient.get(`/api/notices/course/${courseId}`);
    return response.data;
  },

  // 이미지
  // getFilePresignedUrl: async (noticeId, fileId) => {
  //   try {
  //     const response = await apiClient.get(`/api/notices/${noticeId}/files/${fileId}/presigned-url`);
  //     return response.data.presignedUrl;
  //   } catch (error) {
  //     console.error('Error getting presigned URL:', error);
  //     throw error;
  //   }
  // },



  increaseViewCount: async (id) => {
    await apiClient.post(`/api/notices/${id}/view-count`);
  },

  getFilePresignedUrl: async (id, files) => {
    const response = await apiClient.get(`/api/notices/${id}/files/${files}/presigned-url`);
    return response.data.presignedUrl;
  }


};
