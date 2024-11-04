import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Search } from 'lucide-react';

const QnAContent = () => {
  const navigate = useNavigate();

  const qnas = [
    {
      id: 1,
      date: '2024.10.30',
      writer: '임혜린',
      category: 'BACKEND',
      title: 'AWS 인스턴스 구축 관련 질문',
      status: '답변 대기'
    },
    {
      id: 2,
      date: '2024.07.10',
      writer: '임진희',
      category: 'BACKEND',
      title: '프로젝트 초기 설정 관련 질문',
      status: '답변 대기'
    },
    {
      id: 3,
      date: '2024.07.10',
      writer: '박종호',
      category: 'BACKEND',
      title: '엔터티 삭제 질문',
      status: '답변 대기'
    }
  ];

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Q&A</h1>
            <div className="flex items-center gap-4">
              {/* 검색창 */}
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="검색"
                    className="bg-transparent border-none outline-none ml-2"
                />
              </div>
              {/* 글쓰기 버튼 */}
              <button
                  onClick={() => navigate('/qna/write')}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <PenSquare size={20} />
                글쓰기
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
            <tr className="border-y">
              <th className="py-4 text-left">작성일자</th>
              <th className="py-4 text-left">작성자</th>
              <th className="py-4 text-left">질문 유형</th>
              <th className="py-4 text-left">질문내용</th>
              <th className="py-4 text-left">상태</th>
            </tr>
            </thead>
            <tbody>
            {qnas.map((qna) => (
                <tr
                    key={qna.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/qna/${qna.id}`)}
                >
                  <td className="py-4">{qna.date}</td>
                  <td className="py-4">{qna.writer}</td>
                  <td className="py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {qna.category}
                  </span>
                  </td>
                  <td className="py-4">{qna.title}</td>
                  <td className="py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                    {qna.status}
                  </span>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </main>
  );
};

export default QnAContent;
