import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 강의 공지사항/Q&A 섹션 컴포넌트
 * - 공지사항과 Q&A를 탭으로 구분하여 표시
 * - 각 게시글의 제목, 작성자, 날짜, 조회수(공지)/상태(Q&A) 등을 테이블 형태로 표시
 * - 전체보기 기능을 통해 상세 페이지로 이동 가능
 */

const NoticeQnaSection = ({ activeTab, setActiveTab, notices, qnas, onNavigate, courseId }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    onNavigate(activeTab);
  };

  const handleNoticeClick = (noticeId) => {
    navigate(`/courses/${courseId}/notices/${noticeId}`);
  };

  return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex gap-6 mb-6 border-b">
          <button
              onClick={() => setActiveTab('notice')}
              className={`pb-2 font-medium ${
                  activeTab === 'notice'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            공지사항
          </button>
          <button
              onClick={() => setActiveTab('qna')}
              className={`pb-2 font-medium ${
                  activeTab === 'qna'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            Q&A
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
            <th className="py-2 text-left font-medium text-sm">날짜</th>
            {activeTab === 'notice' ? (
                <th className="py-2 text-left font-medium text-sm">조회수</th>
            ) : (
                <th className="py-2 text-left font-medium text-sm">상태</th>
            )}
          </tr>
          </thead>
          <tbody>
          {activeTab === 'notice'
              ? notices.map(notice => (
                  <tr
                      key={notice.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleNoticeClick(notice.id)}
                  >
                    <td className="py-2 text-sm">{notice.id}</td>
                    <td className="py-2 text-sm">{notice.title}</td>
                    <td className="py-2 text-sm">{notice.writer}</td>
                    <td className="py-2 text-sm">{notice.date}</td>
                    <td className="py-2 text-sm">{notice.views}</td>
                  </tr>
              ))
              : qnas.map(qna => (
                  <tr key={qna.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">{qna.id}</td>
                    <td className="py-2 text-sm">{qna.title}</td>
                    <td className="py-2 text-sm">{qna.writer}</td>
                    <td className="py-2 text-sm">{qna.date}</td>
                    <td className="py-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        qna.status === '답변완료'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                      {qna.status}
                    </span>
                    </td>
                  </tr>
              ))
          }
          </tbody>
        </table>
      </div>
  );
};

export default NoticeQnaSection;
