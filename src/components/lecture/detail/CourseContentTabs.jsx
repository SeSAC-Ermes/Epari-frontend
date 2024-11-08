import React from 'react';

const ViewAllButton = ({ activeTab, onNavigate }) => {
  const handleClick = () => {
    switch (activeTab) {
      case 'notice':
        onNavigate('/lecturenoticelist');
        break;
      case 'qna':
        onNavigate('/qnalist');
        break;
      case 'exam':
        onNavigate('/exams');
        break;
      default:
        break;
    }
  };

  return (
      <button
          onClick={handleClick}
          className="text-sm text-green-500 hover:text-green-600"
      >
        전체보기
      </button>
  );
};

const TabContent = ({ activeTab, notices, qnas, examsAndAssignments }) => {
  if (activeTab === 'notice') {
    return (
        <table className="w-full">
          <thead>
          <tr className="border-t border-b">
            <th className="py-3 text-left">No.</th>
            <th className="py-3 text-left">제목</th>
            <th className="py-3 text-left">작성자</th>
            <th className="py-3 text-left">날짜</th>
          </tr>
          </thead>
          <tbody>
          {notices.map((notice) => (
              <tr key={notice.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{notice.id}</td>
                <td className="py-3">{notice.title}</td>
                <td className="py-3">{notice.writer}</td>
                <td className="py-3">{notice.date}</td>
              </tr>
          ))}
          </tbody>
        </table>
    );
  }

  if (activeTab === 'qna') {
    return (
        <table className="w-full">
          <thead>
          <tr className="border-t border-b">
            <th className="py-3 text-left">No.</th>
            <th className="py-3 text-left">제목</th>
            <th className="py-3 text-left">작성자</th>
            <th className="py-3 text-left">날짜</th>
            <th className="py-3 text-left">상태</th>
          </tr>
          </thead>
          <tbody>
          {qnas.map((qna) => (
              <tr key={qna.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{qna.id}</td>
                <td className="py-3">{qna.title}</td>
                <td className="py-3">{qna.writer}</td>
                <td className="py-3">{qna.date}</td>
                <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                    qna.status === '답변완료'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'}`}
                >
                  {qna.status}
                </span>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
    );
  }

  if (activeTab === 'exam') {
    return (
        <table className="w-full">
          <thead>
          <tr className="border-t border-b">
            <th className="py-3 text-left">No.</th>
            <th className="py-3 text-left">구분</th>
            <th className="py-3 text-left">제목</th>
            <th className="py-3 text-left">작성자</th>
            <th className="py-3 text-left">등록일</th>
            <th className="py-3 text-left">마감일</th>
            <th className="py-3 text-left">상태</th>
          </tr>
          </thead>
          <tbody>
          {examsAndAssignments.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{item.id}</td>
                <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.type === '시험'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'}`}
                >
                  {item.type}
                </span>
                </td>
                <td className="py-3">{item.title}</td>
                <td className="py-3">{item.writer}</td>
                <td className="py-3">{item.date}</td>
                <td className="py-3">{item.deadline}</td>
                <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === '진행중'
                        ? 'bg-blue-100 text-blue-600'
                        : item.status === '제출완료'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
    );
  }

  return null;
};

const CourseContentTabs = ({
                             activeTab,
                             setActiveTab,
                             notices,
                             qnas,
                             examsAndAssignments,
                             onNavigate
                           }) => {
  return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-6 mb-6 border-b">
          <div className="flex-1 flex justify-between items-center">
            <div className="flex gap-6">
              <TabButton
                  label="강의 공지사항"
                  isActive={activeTab === 'notice'}
                  onClick={() => setActiveTab('notice')}
              />
              <TabButton
                  label="Q&A"
                  isActive={activeTab === 'qna'}
                  onClick={() => setActiveTab('qna')}
              />
              <TabButton
                  label="시험 및 과제"
                  isActive={activeTab === 'exam'}
                  onClick={() => setActiveTab('exam')}
              />
            </div>
            <ViewAllButton activeTab={activeTab} onNavigate={onNavigate}/>
          </div>
        </div>
        <TabContent
            activeTab={activeTab}
            notices={notices}
            qnas={qnas}
            examsAndAssignments={examsAndAssignments}
        />
      </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => (
    <button
        className={`pb-2 font-medium ${
            isActive
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-gray-400'
        }`}
        onClick={onClick}
    >
      {label}
    </button>
);

export default CourseContentTabs;
