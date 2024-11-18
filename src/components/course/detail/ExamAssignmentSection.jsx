import React, { useState } from 'react';

/**
 * 강의 시험/과제 섹션 컴포넌트
 * - 시험과 과제 목록을 탭으로 구분하여 표시
 * - 각 항목의 제목, 작성자, 등록일, 마감일, 상태 등을 테이블 형태로 표시
 * - 전체보기 기능을 통해 상세 페이지로 이동 가능
 */

const ExamAssignmentSection = ({ examsAndAssignments, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('exam');

  const handleViewAll = () => {
    onNavigate(activeTab); // 'exam' 또는 'assignment'로 전달
  };

  const filteredItems = examsAndAssignments.filter(item =>
      activeTab === 'exam' ? item.type === '시험' : item.type === '과제'
  );

  return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-6 mb-6 border-b">
          <button
              onClick={() => setActiveTab('exam')}
              className={`pb-2 font-medium ${
                  activeTab === 'exam'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            시험
          </button>
          <button
              onClick={() => setActiveTab('assignment')}
              className={`pb-2 font-medium ${
                  activeTab === 'assignment'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            과제
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
            <th className="py-2 text-left font-medium text-sm">등록일</th>
            <th className="py-2 text-left font-medium text-sm">마감일</th>
            <th className="py-2 text-left font-medium text-sm">상태</th>
          </tr>
          </thead>
          <tbody>
          {filteredItems.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-sm">{item.id}</td>
                <td className="py-2 text-sm">{item.title}</td>
                <td className="py-2 text-sm">{item.writer}</td>
                <td className="py-2 text-sm">{item.date}</td>
                <td className="py-2 text-sm">{item.deadline}</td>
                <td className="py-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === 'exam'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                }`}>
                  {item.status}
                </span>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default ExamAssignmentSection;
