import apiClient from '../axios';

/**
 * 시험 관련 API 호출 모음
 */

export const ExamAPI = {
  // 학생의 시험 결과 조회
  getCourseExamResults: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/scores`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  },
};

export default ExamAPI;
