import React from 'react';

/**
 * 공지사항 목록을 테이블 형태로 표시하는 컴포넌트
 * 번호, 제목, 작성자, 날짜, 조회수 정보를 컬럼으로 표시
 */

const NoticeTable = ({ notices, onNoticeClick }) => {
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
        {notices.map((notice) => (
            <tr
                key={notice.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onNoticeClick(notice.id)}
            >
              <td className="py-4 text-center">{notice.displayNumber}</td>
              <td className="py-4 text-center truncate">{notice.title}</td>
              <td className="py-4 text-center">{notice.writer}</td>
              <td className="py-4 text-center">{notice.date}</td>
              <td className="py-4 text-center">{notice.views}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default NoticeTable;
