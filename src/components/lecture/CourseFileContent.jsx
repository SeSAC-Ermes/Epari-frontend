import React, { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseFileContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileData] = useState([
    {
      id: 1,
      date: '2024.10.30',
      author: '임혜린',
      title: 'AWS 인스턴스 구축 관련 문서',
      content: 'AWS EC2 인스턴스 설정 가이드'
    },
    {
      id: 2,
      date: '2024.07.10',
      author: '임진희',
      title: '프로젝트 초기 설정 가이드',
      content: '스프링 부트 프로젝트 환경설정 문서'
    },
    {
      id: 3,
      date: '2024.07.10',
      author: '박종호',
      title: 'JPA 엔티티 설계 문서',
      content: 'JPA 엔티티 설계 및 연관관계 매핑 가이드'
    }
  ]);

  // 검색어에 따른 필터링된 데이터
  const filteredData = fileData.filter(file =>
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">강의 자료</h1>
            <div className="flex items-center gap-4">
              {/* 검색 필드 추가 */}
              <div className="relative">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
              </div>
              <button
                  onClick={() => navigate('/coursefile/create')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FileText size={20}/>
                강의 자료 업로드
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="border-y border-gray-200">
                <th className="py-4 text-center font-medium text-gray-500">작성일자</th>
                <th className="py-4 text-center font-medium text-gray-500">작성자</th>
                <th className="py-4 text-center font-medium text-gray-500">제목</th>
                <th className="py-4 text-center font-medium text-gray-500">자료내용</th>
                <th className="py-4 text-center font-medium text-gray-500">다운로드</th>
              </tr>
              </thead>
              <tbody>
              {filteredData.map((file) => (
                  <tr key={file.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 text-center">{file.date}</td>
                    <td className="py-4 text-center">{file.author}</td>
                    <td className="py-4 text-center">
                    <span className="text-blue-500 hover:underline cursor-pointer">
                      {file.title}
                    </span>
                    </td>
                    <td className="py-4 text-center text-gray-600">{file.content}</td>
                    <td className="py-4 text-center">
                      <button className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700 hover:underline">
                        다운로드
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
};

export default CourseFileContent;
