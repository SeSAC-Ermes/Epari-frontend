import React, { useEffect, useState } from 'react';
import { ExamAPI } from '../../api/exam/examAPI';

const ExamSection = ({ studentId }) => {
  const [examData, setExamData] = useState({
    examResults: [],
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        const data = await ExamAPI.getStudentExamResults(studentId);
        setExamData({
          examResults: data.examResults || [],
          averageScore: data.averageScore || 0
        });
      } catch (err) {
        setError('시험 결과를 불러오는데 실패했습니다.');
        console.error('시험 결과 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchExamResults();
    }
  }, [studentId]);

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
      <div className="space-y-4">
        <h4 className="font-medium">시험 성적</h4>
        <div className="space-y-2">
          {examData.examResults.length > 0 ? (
              <>
                {examData.examResults.map(exam => (
                    <div key={exam.examId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{exam.examTitle}</span>
                      <span className="text-sm font-medium">{exam.earnedScore}점</span>
                    </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">평균 점수</span>
                  <span className="text-sm font-semibold text-blue-600">
                {examData.averageScore.toFixed(1)}점
              </span>
                </div>
              </>
          ) : (
              <div className="text-center text-gray-500 py-4">
                시험 결과가 없습니다
              </div>
          )}
        </div>
      </div>
  );
};

export default ExamSection;
