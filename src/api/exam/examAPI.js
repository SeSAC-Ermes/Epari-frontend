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
  },

  //시험 시작
  startExam: async (courseId, examId) => {
    try {
      const response = await apiClient.post(`/api/courses/${courseId}/exams/${examId}/submission/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting exam:', error);
      throw error;
    }
  },

  // 답안 임시 저장
  saveAnswerTemporarily: async (courseId, examId, questionId, answerData) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/submission/questions/${questionId}/save`,
          answerData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving answer temporarily:', error);
      throw error;
    }
  },

  // 답안 제출
  submitAnswer: async (courseId, examId, questionId, answerData) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/submission/questions/${questionId}`,
          answerData
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },

  // 시험 종료
  finishExam: async (courseId, examId, force = false) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/submission/finish`,
          null,
          { params: { force } }
      );
      return response.data;
    } catch (error) {
      console.error('Error finishing exam:', error);
      throw error;
    }
  },

  // 제출 상태 조회
  getSubmissionStatus: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/submission/status`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching submission status:', error);
      throw error;
    }
  },

  // 학생용 시험 결과 조회
  getExamResult: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/submission/result`
      );
      if (!response.data) {
        throw new Error('시험 결과 데이터가 없습니다.');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching exam result:', error);
      if (error.response?.status === 404) {
        throw new Error('시험 결과를 찾을 수 없습니다.');
      }
      if (error.response?.status === 403) {
        throw new Error('시험 결과를 조회할 권한이 없습니다.');
      }
      throw error;
    }
  },

  // 교수자용 시험 결과 목록 조회
  getExamResults: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/submission/results`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  },

  // 시험 채점하기
  gradeExam: async (courseId, examId, resultId) => {
    try {
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/grades/results/${resultId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error grading exam:', error);
      throw error;
    }
  },

  // 시험 통계 조회
  getExamStatistics: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/grades/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      throw error;
    }
  },

  // 평균 점수 조회
  getAverageScore: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/grades/average`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching average score:', error);
      throw error;
    }
  },

  // 강사용 채점 목록 조회
  getGradingList: async (courseId, examId) => {
    try {
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/submission/results`
      );
      if (!response.data) {
        throw new Error('제출된 시험이 없습니다.');
      }

      // ID 필드 통일 및 데이터 정제
      const submissions = response.data.map(submission => ({
        ...submission,
        examResultId: submission.id || submission.examResultId,
        studentName: submission.studentName || '이름 없음',
        status: submission.status || 'PENDING',
        submittedAt: submission.submittedAt || null,
        totalScore: submission.totalScore || 0
      }));

      return submissions;
    } catch (error) {
      console.error('Error fetching grading list:', error);
      if (error.response?.status === 403) {
        throw new Error('채점 목록을 조회할 권한이 없습니다.');
      }
      throw error;
    }
  },

  // 학생 개별 답안 조회
  getStudentSubmission: async (courseId, examId, resultId) => {
    try {
      if (!resultId) {
        throw new Error('Result ID is required');
      }
      const response = await apiClient.get(
          `/api/courses/${courseId}/exams/${examId}/submission/results/${resultId}/detail`
      );
      if (!response.data) {
        throw new Error('답안 상세 정보가 없습니다.');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching student submission:', error);
      if (error.response?.status === 404) {
        throw new Error('답안을 찾을 수 없습니다.');
      }
      if (error.response?.status === 403) {
        throw new Error('답안을 조회할 권한이 없습니다.');
      }
      throw error;
    }
  },

  // 채점 제출
  submitGrading: async (courseId, examId, resultId, gradingData) => {
    try {
      if (!resultId) {
        throw new Error('Result ID is required');
      }
      const response = await apiClient.post(
          `/api/courses/${courseId}/exams/${examId}/grades/results/${resultId}`,
          gradingData
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting grading:', error);
      if (error.response?.status === 404) {
        throw new Error('채점할 시험을 찾을 수 없습니다.');
      }
      if (error.response?.status === 403) {
        throw new Error('채점할 권한이 없습니다.');
      }
      throw error;
    }
  }

};

export default ExamAPI;
