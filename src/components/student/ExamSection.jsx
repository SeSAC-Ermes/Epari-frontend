import React from 'react';

/**
 * 학생의 시험 성적을 표시하는 컴포넌트
 */

const ExamSection = ({ exams = [], loading = false, error = null }) => {
  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // 평균 점수 계산
  const averageScore = exams.length > 0
      ? exams.reduce((sum, exam) => sum + exam.earnedScore, 0) / exams.length
      : 0;

  return (
      <div className="space-y-4">
        <h4 className="font-medium">시험 성적</h4>
        <div className="space-y-2">
          {exams.length > 0 ? (
              <>
                {exams.map(exam => (
                    <div
                        key={exam.examId}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{exam.examTitle}</span>
                      <span className="text-sm font-medium">{exam.earnedScore}점</span>
                    </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">평균 점수</span>
                  <span className="text-sm font-semibold text-blue-600">
                {averageScore.toFixed(1)}점
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
