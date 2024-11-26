import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NoticeApi } from '../../api/notice/NoticeApi';
import { Plus, Search } from 'lucide-react';
import { RoleBasedComponent } from "../../auth/RoleBasedComponent.jsx";


const NoticeListContent = ({ type }) => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { courseId } = useParams();
  const noticesPerPage = 10;

  useEffect(() => {
    loadNotices();
  }, [courseId, type]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (type === 'GLOBAL') {
        response = await NoticeApi.getGlobalNotices();
      } else {
        response = await NoticeApi.getCourseNotices(courseId);
      }

      setNotices(response);
    } catch (error) {
      console.error('공지사항을 불러오는데 실패했습니다:', error);
      setError('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = (noticeId) => {
    if (type === 'GLOBAL') {
      navigate(`/notices/${noticeId}`);
    } else {
      navigate(`/courses/${courseId}/notices/${noticeId}`);
    }
  };

  const handleWriteClick = () => {
    if (type === 'GLOBAL') {
      navigate('/notices/create');
    } else {
      navigate(`/courses/${courseId}/notices/create`);
    }
  };

  // 검색 기능
  const filteredNotices = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  // 페이지 번호 생성
  const pageNumbers = [];
  const maxPageNumbers = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <div className="w-full">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {type === 'GLOBAL' ? '전체 공지사항' : '강의 공지사항'}
              </h1>
              <div className="flex items-center gap-4">
                {/* 글쓰기 버튼 - 강사 권한 확인 */}
                <RoleBasedComponent requiredRoles={['INSTRUCTOR']}>
                  <button
                      onClick={handleWriteClick}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus size={20}/>
                    글작성
                  </button>
                </RoleBasedComponent>

                {/* 검색 영역 */}
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                  <Search className="text-gray-400" size={20}/>
                  <input
                      type="text"
                      placeholder="검색"
                      className="bg-transparent border-none outline-none ml-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead>
              <tr className="border-y">
                <th className="py-4 text-center w-20">No.</th>
                <th className="py-4 text-center w-96">제목</th>
                <th className="py-4 text-center w-32">작성자</th>
                <th className="py-4 text-center w-32">날짜</th>
                <th className="py-4 text-center w-32">조회수</th>
              </tr>
              </thead>
              <tbody>
              {currentNotices.map((notice) => (
                  <tr
                      key={notice.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleNoticeClick(notice.id)}
                  >
                    <td className="py-4 text-center">{notice.displayNumber}</td>
                    <td className="py-4 text-center truncate">{notice.title}</td>
                    <td className="py-4 text-center">{notice.instructorName || '-'}</td>
                    <td className="py-4 text-center">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-center">{notice.viewCount}</td>
                  </tr>
              ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
              >
                이전
              </button>

              {pageNumbers.map(number => (
                  <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded border ${
                          currentPage === number ? 'bg-blue-500 text-white' : ''
                      }`}
                  >
                    {number}
                  </button>
              ))}

              <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        </main>
      </div>
  );
};

export default NoticeListContent;
