import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamAPI } from '../../../api/exam/examAPI';

const ExamAssignmentSection = ({ courseId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('exam');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examResponse, setExamResponse] = useState(null);
  const navigate = useNavigate();

  // 과제 더미데이터 유지
  const assignments = [
    {
      id: 2,
      type: '과제',
      title: 'AWS EC2 인스턴스 생성 실습',
      writer: '윤지수',
      date: '2024/10/05',
      deadline: '2024/10/19',
      status: '제출완료'
    }
  ];

  useEffect(() => {
    const fetchExams = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const response = await ExamAPI.getExams(courseId);
          setExamResponse(response); // API 응답 전체를 상태로 저장

          // 모든 시험 데이터를 하나의 배열로 합치기
          const allExams = [
            ...(response.scheduledExams || []),
            ...(response.inProgressExams || []),
            ...(response.completedExams || [])
          ];

          // 시험 응시일자를 기준으로 정렬하고 앞의 2개만 선택
          const sortedExams = allExams
              .sort((a, b) => new Date(a.examDateTime) - new Date(b.examDateTime))
              .slice(0, 2)
              .map(exam => ({
                id: exam.id,
                title: exam.title,
                writer: exam.instructor?.name || '-',
                examDateTime: exam.examDateTime,
                duration: exam.duration
              }));

          setExams(sortedExams);
        } catch (error) {
          console.error('Error fetching exams:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExams();
  }, [courseId]);

  const getExamStatus = (exam) => {
    if (!examResponse) return '-';

    if (examResponse.scheduledExams?.some(e => e.id === exam.id)) {
      return '예정';
    }
    if (examResponse.inProgressExams?.some(e => e.id === exam.id)) {
      return '진행중';
    }
    if (examResponse.completedExams?.some(e => e.id === exam.id)) {
      return '완료';
    }
    return '-';
  };


  const handleViewAll = () => {
    onNavigate(activeTab);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    if (activeTab === 'exam') {
      if (loading) {
        return (
            <tr>
              <td colSpan="6" className="py-4 text-center">
                로딩 중...
              </td>
            </tr>
        );
      }

      return exams.map((exam, index) => (
          <tr key={exam.id} className="border-b hover:bg-gray-50">
            <td className="py-2 text-sm">{index + 1}</td>
            <td className="py-2 text-sm">
              <button
                  onClick={() => navigate(`/courses/${courseId}/exams/${exam.id}`)}
                  className="text-left hover:text-blue-600 hover:underline"
              >
                {exam.title}
              </button>
            </td>
            <td className="py-2 text-sm">{exam.writer}</td>
            <td className="py-2 text-sm">{formatDate(exam.examDateTime)}</td>
            <td className="py-2 text-sm">{exam.duration}분</td>
            <td className="py-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
                getExamStatus(exam) === '진행중'
                    ? 'bg-blue-100 text-blue-600'
                    : getExamStatus(exam) === '완료'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-yellow-600'
            }`}>
              {getExamStatus(exam)}
            </span>
            </td>
          </tr>
      ));
    } else {
      return assignments.map((item, index) => (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="py-2 text-sm">{index + 1}</td>
            <td className="py-2 text-sm">{item.title}</td>
            <td className="py-2 text-sm">{item.writer}</td>
            <td className="py-2 text-sm">{item.date}</td>
            <td className="py-2 text-sm">{item.deadline}</td>
            <td className="py-2">
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
              {item.status}
            </span>
            </td>
          </tr>
      ));
    }
  };

  return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-6 mb-6 border-b">
          <button
              onClick={() => setActiveTab('exam')}
              className={`pb-2 font-medium ${
                  activeTab === 'exam'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            시험
          </button>
          <button
              onClick={() => setActiveTab('assignment')}
              className={`pb-2 font-medium ${
                  activeTab === 'assignment'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            과제
          </button>
          <div className="flex-1"></div>
          <button
              onClick={handleViewAll}
              className="text-sm text-green-600 hover:underline"
          >
            전체보기
          </button>
        </div>

        <table className="w-full">
          <thead>
          <tr className="border-y">
            <th className="py-2 text-left font-medium text-sm">No.</th>
            <th className="py-2 text-left font-medium text-sm">제목</th>
            <th className="py-2 text-left font-medium text-sm">작성자</th>
            {activeTab === 'exam' ? (
                <>
                  <th className="py-2 text-left font-medium text-sm">시험 응시 일자</th>
                  <th className="py-2 text-left font-medium text-sm">제한 시간</th>
                </>
            ) : (
                <>
                  <th className="py-2 text-left font-medium text-sm">등록일</th>
                  <th className="py-2 text-left font-medium text-sm">마감일</th>
                </>
            )}
            <th className="py-2 text-left font-medium text-sm">상태</th>
          </tr>
          </thead>
          <tbody>
          {renderContent()}
          </tbody>
        </table>
      </div>
  );
};

export default ExamAssignmentSection;
