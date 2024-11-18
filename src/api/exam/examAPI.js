import apiClient from '../axios';

/**
 * 시험 관련 API 호출 모음
 */

export const ExamAPI = {
  // 학생의 시험 결과 조회
  getStudentExamResults: async (studentId) => {
    try {
      const response = await apiClient.get(`/api/scores/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('시험 결과 조회 실패:', error);
      throw error;
    }
  }
};

export default ExamAPI;
