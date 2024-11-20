import apiClient from "../axios.js";

export const NoticeApi = {
  // 공지사항 생성
  createNotice: async (formData) => {
    try {
      const response = await apiClient.post('/api/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('공지사항 생성 실패:', error);
      throw error;
    }
  },

  // 단일 공지사항 조회
  getNotice: async (id) => {
    try {
      const response = await apiClient.get(`/api/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
      throw error;
    }
  },

  // 공지사항 수정
  updateNotice: async (id, formData) => {
    try {
      const response = await apiClient.put(`/api/notices/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      throw error;
    }
  },

  // 공지사항 삭제
  deleteNotice: async (id) => {
    try {
      const response = await apiClient.delete(`/api/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      throw error;
    }
  },

  // 전체 글로벌 공지사항 조회
  getGlobalNotices: async () => {
    try {
      const response = await apiClient.get('/api/notices/global');
      return response.data;
    } catch (error) {
      console.error('전체 공지사항 조회 실패:', error);
      throw error;
    }
  },

  // 강의 공지사항 조회
  getCourseNotices: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/notices/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('강의 공지사항 조회 실패:', error);
      throw error;
    }
  },

  // 파일 다운로드 URL 가져오기
  getFilePresignedUrl: async (noticeId, fileId) => {
    try {
      const response = await apiClient.get(`/api/notices/${noticeId}/files/${fileId}/presigned-url`);
      return response.data.presignedUrl;
    } catch (error) {
      console.error('파일 URL 조회 실패:', error);
      throw error;
    }
  },

  // 파일 다운로드
  downloadFile: async (noticeId, fileId) => {
    try {
      const response = await apiClient.get(
          `/api/notices/${noticeId}/files/${fileId}/download`,
          {
            responseType: 'blob',
            headers: {
              Accept: 'application/octet-stream',
            },
          }
      );
      return response.data;
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      throw error;
    }
  },

  // 에러 응답 처리를 위한 유틸리티 메서드
  handleError: (error) => {
    if (error.response) {
      // 서버가 2xx 범위를 벗어난 상태 코드를 반환한 경우
      if (error.response.status === 404) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      } else if (error.response.status === 403) {
        throw new Error('권한이 없습니다.');
      } else if (error.response.status === 401) {
        throw new Error('로그인이 필요합니다.');
      } else {
        throw new Error(error.response.data.message || '서버 오류가 발생했습니다.');
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      throw new Error('요청 중 오류가 발생했습니다.');
    }
  }
};

export default NoticeApi;
