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

  // 시험 설정 생성
  createExam: async (courseId, examData) => {
    try {
      const response = await apiClient.post(`/api/courses/${courseId}/exams`, examData);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  // 시험 목록 조회
  getExams: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/exams`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  // 시험 상세 조회
  getExam: async (courseId, examId) => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}/exams/${examId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw error;
    }
  },

  // 시험 수정
  updateExam: async (courseId, examId, examData) => {
    try {
      const response = await apiClient.put(`/api/courses/${courseId}/exams/${examId}`, examData);
      return response.data;
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },
  // 시험 삭제
  deleteExam: async (courseId, examId) => {
    try {
      await apiClient.delete(`/api/courses/${courseId}/exams/${examId}`);
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  },

  // 문제 생성 API 추가
  createQuestion: async (courseId, examId, questionData) => {
    try {
      console.log('Sending question data:', questionData); // 데이터 확인용 로그
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/questions`,
          questionData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      if (error.response) {
        console.log('Server error response:', error.response.data); // 서버 에러 응답 확인
      }
      throw error;
    }
  },

  // 문제 순서 변경
  reorderQuestion: async (courseId, examId, questionId, newNumber) => {
    try {
      await apiClient.put(
          `/api/courses/${courseId}/exams/${examId}/questions/${questionId}/order?newNumber=${newNumber}`
      );
    } catch (error) {
      console.error('Error reordering question:', error);
      throw error;
    }
  },

  // 문제 수정
  updateQuestion: async (courseId, examId, questionId, questionData) => {
    try {
      const response = await apiClient.put(
          `/api/courses/${courseId}/exams/${examId}/questions/${questionId}`,
          questionData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  // 문제 삭제
  deleteQuestion: async (courseId, examId, questionId) => {
    try {
      await apiClient.delete(
          `/api/courses/${courseId}/exams/${examId}/questions/${questionId}`
      );
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
};

export default ExamAPI;
