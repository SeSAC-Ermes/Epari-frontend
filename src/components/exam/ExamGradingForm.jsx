import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamAPI } from '../../api/exam/examAPI.js';

export const ExamGradingForm = () => {
  const { courseId, examId, submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        console.log('Fetching submission with params:', { courseId, examId, submissionId });
        if (!submissionId) {
          setError('제출 ID가 없습니다.');
          return;
        }
        const data = await ExamAPI.getStudentSubmission(courseId, examId, submissionId);
        console.log('Received submission data:', data);
        setSubmission(data);

        // 기존 점수 초기화
        const initialScores = {};
        data.questionResults.forEach(result => {
          initialScores[result.questionId] = result.score || 0;
        });
        setScores(initialScores);
      } catch (err) {
        setError('답안을 불러오는데 실패했습니다.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && examId && submissionId) {
      fetchSubmission();
    }
  }, [courseId, examId, submissionId]);

  const handleScoreChange = (questionId, score) => {
    const question = submission.questionResults.find(q => q.questionId === questionId);
    const maxScore = question.maxScore;
    const newScore = Math.min(Math.max(0, parseInt(score) || 0), maxScore);
    setScores(prev => ({
      ...prev,
      [questionId]: newScore
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const gradingData = {
        scores: Object.entries(scores).map(([questionId, score]) => ({
          questionId: parseInt(questionId),
          score
        }))
      };

      await ExamAPI.submitGrading(courseId, examId, submissionId, gradingData);
      navigate(`/courses/${courseId}/exams/${examId}/grading`);
    } catch (err) {
      setError('채점 저장에 실패했습니다.');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"/>
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">답안 채점</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              학생: {submission.studentName}
            </div>
            <button
                onClick={() => navigate(`/courses/${courseId}/exams/${examId}/grading`)}
                className="text-gray-600 hover:text-gray-900"
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-6">
            {submission.questionResults.map((question, index) => (
                <div key={question.questionId} className="border-t pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">문제 {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">배점:</span>
                      <input
                          type="number"
                          min="0"
                          max={question.maxScore}
                          value={scores[question.questionId] || 0}
                          onChange={(e) => handleScoreChange(question.questionId, e.target.value)}
                          className="w-20 px-3 py-1 border rounded-lg"
                      />
                      <span className="text-sm text-gray-500">/ {question.maxScore}점</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">문제</div>
                    <p className="text-gray-800">{question.questionTitle}</p>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">학생 답안</div>
                    <p className="text-gray-800">{question.studentAnswer}</p>
                  </div>
                </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <div className="text-lg font-medium">
              총점: <span className="text-blue-600">{calculateTotalScore()}</span>점
            </div>
            <div className="flex gap-4">
              <button
                  onClick={() => navigate(`/courses/${courseId}/exams/${examId}/grading`)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                취소
              </button>
              <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? '저장 중...' : '채점 완료'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ExamGradingForm;
