import React, { useState, useEffect } from 'react';
import { NoticeApi } from '../../api/notice/NoticeApi';  // API 경로 수정
import { Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const { courseId } = useParams();

const NoticeListContent = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'course'
  const noticesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadNotices();
  }, [activeTab]);


  const handleNoticeClick = (noticeId) => {
    navigate(`/courses/${courseId}/notices/${noticeId}`);
  };

  const loadNotices = async () => {
    try {
      let response;
      if (activeTab === 'global') {
        response = await NoticeApi.getGlobalNotices();
      } else {
        // 임시로 courseId를 1로 설정하거나, 실제 courseId를 가져와서 사용
        response = await NoticeApi.getCourseNotices(1);
      }
      setNotices(response);
    } catch (error) {
      console.error('공지사항을 불러오는데 실패했습니다:', error);
    }
  };

  // 검색 기능
  const filteredNotices = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.writer?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
      <div className="w-full">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {activeTab === 'global' ? '전체 공지사항' : '강의 공지사항'}
              </h1>
              <div className="flex items-center gap-4">
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
