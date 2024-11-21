import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

/**
 * 학생이 제출한 과제 현황을 표시하는 컴포넌트
 */
const AssignmentSection = ({ courseId, student, className }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const submissions = await SubmissionAPI.getStudentSubmissions(courseId, student.id);
        setSubmissions(submissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('과제 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && student?.id) {
      fetchSubmissions();
    }
  }, [courseId, student?.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case '통과':
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
            <Check size={12} />
            Pass
          </span>
        );
      case '미통과':
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
            <X size={12} />
            Non-Pass
          </span>
        );
      default:
        return (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
            평가중
          </span>
        );
    }
  };

  if (loading) {
    return (
        <div className={className}>
          <h4 className="font-medium mb-4">과제 제출 현황</h4>
          <div className="text-center text-gray-500 py-4">로딩 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className={className}>
          <h4 className="font-medium mb-4">과제 제출 현황</h4>
          <div className="text-center text-red-500 py-4">{error}</div>
        </div>
    );
  }

  return (
      <div className={className}>
        <h4 className="font-medium mb-4">과제 제출 현황</h4>
        <div className="space-y-3">
          {submissions.length > 0 ? (
              submissions.map(submission => (
                  <div key={submission.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <h5 className="font-medium">{submission.title}</h5>
                        <p className="text-sm text-gray-500">
                          제출일: {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                    {submission.feedback && (
                        <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded">
                          <p className="font-medium mb-1">피드백</p>
                          {submission.feedback}
                        </div>
                    )}
                  </div>
              ))
          ) : (
              <div className="text-center text-gray-500 py-4">
                제출한 과제가 없습니다.
              </div>
          )}
        </div>
      </div>
  );
};

export default AssignmentSection;
