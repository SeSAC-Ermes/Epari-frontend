import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ExamAPI } from '../../api/exam/examAPI.js';
import { RoleBasedComponent } from '../../auth/RoleBasedComponent';
import { ROLES } from '../../constants/auth';
import { useAuth } from '../../auth/AuthContext';

export const ExamContainer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  // useAuth hook을 통해 user 정보를 가져옵니다
  const [examData, setExamData] = useState({
    scheduledExams: [],
    inProgressExams: [],
    completedExams: []
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // user 정보를 바탕으로 instructor 여부를 판단
  const isInstructor = user?.roles?.includes(ROLES.INSTRUCTOR);

  const getStatusBadge = (exam) => {
    if (examData.scheduledExams?.some(e => e.id === exam.id)) {
      return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          예정
        </span>
      );
    }
    if (examData.inProgressExams?.some(e => e.id === exam.id)) {
      return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          진행중
        </span>
      );
    }
    if (examData.completedExams?.some(e => e.id === exam.id)) {
      return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          완료
        </span>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return '-';
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await ExamAPI.getExams(courseId);
        console.log('First exam:', response.scheduledExams[0]);
        setExamData(response);
      } catch (err) {
        setError('시험 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching exams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [courseId]);

  // 모든 시험을 하나의 배열로 합치기
  const allExams = [
    ...(examData.scheduledExams || []),
    ...(examData.inProgressExams || []),
    ...(examData.completedExams || [])
  ];

  const filteredExams = allExams.filter(exam =>
      exam?.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleScoreClick = (exam) => {
    if (!exam?.id) {
      console.error('Invalid exam ID');
      return;
    }

    // 강사는 grading 페이지로, 학생은 result 페이지로 이동
    const path = isInstructor ? 'grading' : 'result';
    navigate(`/courses/${courseId}/exams/${exam.id}/${path}`);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 헤더 섹션 */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">시험 관리</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input
                      type="text"
                      placeholder="시험 제목 검색"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                  <button
                      type="button"
                      onClick={() => navigate(`/courses/${courseId}/exams/settings`)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    시험 출제하기
                  </button>
                </RoleBasedComponent>
              </div>
            </div>
          </div>

          {/* 테이블 섹션 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="py-4 text-left text-sm font-medium text-gray-600">No.</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">상태</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">시험 출제 일자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">제목</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">작성자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">시험 응시 일자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">제한 시간</th>
                <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">응시 인원</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">평균 점수</th>
                </RoleBasedComponent>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">점수 확인</th>
              </tr>
              </thead>
              <tbody>
              {filteredExams.length > 0 ? (
                  filteredExams.map((exam, index) => (
                      <tr key={exam?.id || index} className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="py-4 text-sm">{getStatusBadge(exam)}</td>
                        <td className="py-4 text-sm text-gray-500">{formatDate(exam?.createdAt)}</td>
                        <td className="py-4 text-sm text-gray-900 font-medium">
                          <button
                              onClick={() => navigate(`/courses/${courseId}/exams/${exam?.id}`)}
                              className="hover:text-blue-600 hover:underline cursor-pointer transition-colors focus:outline-none"
                          >
                            {exam?.title}
                          </button>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{exam?.instructor?.name || '-'}</td>
                        <td className="py-4 text-sm text-gray-500">{formatDate(exam?.examDateTime)}</td>
                        <td className="py-4 text-sm text-gray-500">{exam?.duration}분</td>
                        <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                          <td className="py-4 text-sm text-gray-500">
                            {exam?.statistics?.submittedStudentCount || 0}/{exam?.statistics?.totalStudentCount || 0}
                          </td>
                          <td className="py-4 text-sm text-gray-500">
                            {exam?.statistics?.averageScore ? exam.statistics.averageScore.toFixed(1) : '-'}
                          </td>
                        </RoleBasedComponent>
                        <td className="py-4 text-sm">
                          <button
                              onClick={() => handleScoreClick(exam)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            점수 확인
                          </button>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-500">
                      {searchKeyword ? '검색 결과가 없습니다.' : '등록된 시험이 없습니다.'}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
};

export default ExamContainer;
