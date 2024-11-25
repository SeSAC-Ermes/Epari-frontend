import apiClient from "../axios.js";

export const NoticeApi = {
  // 공지사항 생성
  createNotice: async (formData) => {
    try {
      // 요청 데이터 확인
      console.log("=== Request Data ===");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await apiClient.post('/api/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('공지사항 생성 실패:', error);
      if (error.response?.data?.errors) {
        console.error('Validation errors details:',
            JSON.stringify(error.response.data.errors, null, 2));
      }
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

  // 공지사항 수정
  updateNotice: async (id, formData) => {
    try {
      // 요청 데이터 확인을 위한 로깅
      console.log("=== Request Data ===");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await apiClient.put(`/api/notices/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      if (error.response?.data?.errors) {
        console.error('Validation errors details:',
            JSON.stringify(error.response.data.errors, null, 2));
      }
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

  // 조회수 증가
  increaseViewCount: async (id) => {
    try {
      await apiClient.put(`/api/notices/${id}/viewCount`);
    } catch (error) {
      console.error('조회수 증가 실패:', error);
      throw error;
    }
  },


  // 이미지 업로드용 메서드 추가
  async uploadImage(formData) {
    try {
      console.log('API 요청 시작');
      const response = await apiClient.post('/api/notices/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('API 응답:', response);
      return response.data;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },
  // async uploadImage(formData) {
  //   try {
  //     const response = await axios.post('/api/notices/upload-image', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Image upload error:', error);
  //     throw error;
  //   }
  // },

  // 파일 다운로드
  downloadFile: async (noticeId, fileId) => {
    try {
      const response = await apiClient.get(`/api/notices/${noticeId}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      throw error;
    }
  },
};

export default NoticeApi;
