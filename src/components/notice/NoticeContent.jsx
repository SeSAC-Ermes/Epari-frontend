import React from 'react';
import { Search } from 'lucide-react';

const LectureNoticeContent = () => {
  const notices = [
    {
      id: 1,
      title: '센터 휴관일 안내',
      writer: '새싹관리자',
      date: '2024/10/13',
      views: 245
    },
    {
      id: 2,
      title: 'AWS 계정 안내',
      writer: '새싹관리자',
      date: '2024/10/14',
      views: 189
    }
  ];

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">공지사항</h1>
            {/* 검색창 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="검색"
                    className="bg-transparent border-none outline-none ml-2"
                />
              </div>
            </div>
          </div>

          <table className="w-full table-fixed">
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
                <tr key={notice.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 text-center">{notice.id}</td>
                  <td className="py-4 text-center truncate">{notice.title}</td>
                  <td className="py-4 text-center">{notice.writer}</td>
                  <td className="py-4 text-center">{notice.date}</td>
                  <td className="py-4 text-center">{notice.views}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </main>
  );
};

export default LectureNoticeContent;
