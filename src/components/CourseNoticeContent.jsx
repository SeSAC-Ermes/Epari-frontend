import React from 'react';
import { Search } from 'lucide-react';

const CourseNoticeContent = () => {
  const notices = [
    {
      id: 1,
      title: '휴강 안내',
      writer: '윤지수',
      date: '2024/09/13'
    },
    {
      id: 2,
      title: 'AWS 계정 안내',
      writer: '윤지수',
      date: '2024/09/13'
    },
    {
      id: 3,
      title: '[1차 프로젝트] 팀 편성 안내',
      writer: '윤지수',
      date: '2024/09/13'
    },
    {
      id: 4,
      title: '[Quiz] AWS 시험',
      writer: '윤지수',
      date: '2024/09/13'
    }
  ];

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">강의 공지사항</h1>
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

          <table className="w-full">
            <thead>
            <tr className="border-y">
              <th className="py-4 text-left">No.</th>
              <th className="py-4 text-left">제목</th>
              <th className="py-4 text-left">작성자</th>
              <th className="py-4 text-left">날짜</th>
            </tr>
            </thead>
            <tbody>
            {notices.map((notice) => (
                <tr key={notice.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-4">{notice.id}</td>
                  <td className="py-4">{notice.title}</td>
                  <td className="py-4">{notice.writer}</td>
                  <td className="py-4">{notice.date}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </main>
  );
};

export default CourseNoticeContent;
