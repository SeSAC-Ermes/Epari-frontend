import apiClient from "../axios.js";

export const NoticeApi = {
  // 공지사항 생성
  createNotice: async (noticeData) => {
    try {
      const response = await apiClient.post('/api/notices', noticeData);
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
      if (error.response?.status === 500) {
        throw new Error('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      console.error('공지사항 조회 실패:', error);
      throw error;
    }
  },

  // 공지사항 수정
  updateNotice: async (id, noticeData) => {
    try {
      const response = await apiClient.put(`/api/notices/${id}`, noticeData);
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

  // 전체 공지사항 조회
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

  // 조회수 증가
  increaseViewCount: async (id) => {
    try {
      // PUT 메서드로 변경
      const response = await apiClient.put(`/api/notices/${id}/viewCount`);
      return response.data;
    } catch (error) {
      // 404 에러의 경우 조용히 처리
      if (error.response?.status === 404) {
        console.warn('조회수 증가 API가 없습니다.');
        return;
      }
      console.error('조회수 증가 실패:', error);
      throw error;
    }
  },

  // 파일 URL 가져오기
  getFilePresignedUrl: async (id, fileId) => {
    try {
      const response = await apiClient.get(`/api/notices/${id}/files/${fileId}/presigned-url`);
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


};


// import apiClient from "../axios.js";
//
// export const NoticeApi = {
//   // 공지사항 생성
//   createNotice: async (noticeData) => {
//     try {
//       const response = await apiClient.post('/api/notices', noticeData);
//       return response.data;
//     } catch (error) {
//       console.error('공지사항 생성 실패:', error);
//       throw error;
//     }
//   },
//
//   // 단일 공지사항 조회
//   getNotice: async (id) => {
//     try {
//       const response = await apiClient.get(`/api/notices/${id}`);
//       return response.data;
//     } catch (error) {
//       if (error.response?.status === 500) {
//         throw new Error('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//       }
//       console.error('공지사항 조회 실패:', error);
//       throw error;
//     }
//   },
//
//   // 공지사항 수정
//   updateNotice: async (id, noticeData) => {
//     try {
//       const response = await apiClient.put(`/api/notices/${id}`, noticeData);
//       return response.data;
//     } catch (error) {
//       console.error('공지사항 수정 실패:', error);
//       throw error;
//     }
//   },
//
//   // 공지사항 삭제
//   deleteNotice: async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/notices/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('공지사항 삭제 실패:', error);
//       throw error;
//     }
//   },
//
//   // 전체 공지사항 조회
//   getGlobalNotices: async () => {
//     try {
//       const response = await apiClient.get('/api/notices/global');
//       return response.data;
//     } catch (error) {
//       console.error('전체 공지사항 조회 실패:', error);
//       throw error;
//     }
//   },
//
//   // 강의 공지사항 조회
//   getCourseNotices: async (courseId) => {
//     try {
//       const response = await apiClient.get(`/api/notices/course/${courseId}`);
//       return response.data;
//     } catch (error) {
//       console.error('강의 공지사항 조회 실패:', error);
//       throw error;
//     }
//   },
//
//   // 조회수 증가
//   // increaseViewCount: async (id) => {
//   //   try {
//   //     const response = await apiClient.post(`/api/notices/${id}/view-count`);
//   //     return response.data;
//   //   } catch (error) {
//   //     console.error('조회수 증가 실패:', error);
//   //     throw error;
//   //   }
//   // },
//
//   // 조회수 증가
//   increaseViewCount: async (id) => {
//     try {
//       // PUT 메서드로 변경
//       const response = await apiClient.put(`/api/notices/${id}/view-count`);
//       return response.data;
//     } catch (error) {
//       // 404 에러의 경우 조용히 처리
//       if (error.response?.status === 404) {
//         console.warn('조회수 증가 API가 없습니다.');
//         return;
//       }
//       console.error('조회수 증가 실패:', error);
//       throw error;
//     }
//   },
//
//   // 파일 URL 가져오기
//   getFilePresignedUrl: async (id, fileId) => {
//     try {
//       const response = await apiClient.get(`/api/notices/${id}/files/${fileId}/presigned-url`);
//       return response.data.presignedUrl;
//     } catch (error) {
//       console.error('파일 URL 조회 실패:', error);
//       throw error;
//     }
//   },
//
//
//
//
//
//
// };
//


export default NoticeApi;


// // import apiClient from './apiClient';
// import apiClient from "../axios.js";
//
// export const NoticeApi = {
//   // 공지사항 생성
//   createNotice: async (noticeData) => {
//     const response = await apiClient.post('/api/notices', noticeData);
//     return response.data;
//   },
//
//   // 단일 공지사항 조회
//   getNotice: async (id) => {
//     const response = await apiClient.get(`/api/notices/${id}`);
//     return response.data;
//   },
//
//
//   // 공지사항 수정
//   updateNotice: async (id, noticeData) => {
//     const response = await apiClient.put(`/api/notices/${id}`, noticeData);
//     return response.data;
//   },
//
//   // 공지사항 삭제
//   deleteNotice: async (id) => {
//     const response = await apiClient.delete(`/api/notices/${id}`);
//     return response.data;
//   },
//
//   // 전체 공지사항 조회
//   getGlobalNotices: async () => {
//     const response = await apiClient.get('/api/notices/global');
//     return response.data;
//   },
//
//   // 강의 공지사항 조회
//   getCourseNotices: async (courseId) => {
//     const response = await apiClient.get(`/api/notices/course/${courseId}`);
//     return response.data;
//   },
//
//
//
//   increaseViewCount: async (id) => {
//     try {
//       await apiClient.post(`/api/notices/${id}/view-count`);
//     } catch (error) {
//       console.error('조회수 증가에 실패했습니다:', error);
//     }
//   },
//
//
//   getFilePresignedUrl: async (id, files) => {
//     const response = await apiClient.get(`/api/notices/${id}/files/${files}/presigned-url`);
//     return response.data.presignedUrl;
//   }
//
//
//
//
// };
