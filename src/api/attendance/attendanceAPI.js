import apiClient from '../axios';

/**
 *  출석 관련 API 호출 모음
 */
export const AttendanceAPI = {
  // 학생별 출석 통계 조회
  getAttendanceStats: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      throw error;
    }
  }
};

export default AttendanceAPI;
