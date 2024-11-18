import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 공지사항 목록을 테이블 형태로 표시하는 컴포넌트
 * 번호, 제목, 작성자, 날짜, 조회수 정보를 컬럼으로 표시
 * 클릭 시 해당 공지사항의 상세 페이지로 이동
 */

const NoticeTable = ({ notices }) => {
  const navigate = useNavigate();

  // 최신 5개의 공지사항만 표시
  const recentNotices = notices.slice(0, 5);

  const handleNoticeClick = (noticeId) => {
    navigate(`/notices/${noticeId}`);
  };

  return (
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
        {recentNotices.map((notice) => (
            <tr
                key={notice.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleNoticeClick(notice.id)}
            >
              <td className="py-4 text-center">{notice.displayNumber}</td>
              <td className="py-4 text-center truncate">{notice.title}</td>
              <td className="py-4 text-center">{notice.instructorName}</td>
              <td className="py-4 text-center">
                {new Date(notice.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 text-center">{notice.viewCount}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default NoticeTable;
