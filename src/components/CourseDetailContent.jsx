import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const CourseDetailContent = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const navigate = useNavigate();

  // 강의 정보 더미 데이터
  const courseInfo = {
    id: 1,
    title: '(영등포6기) AWS 클라우드를 활용한 MSA 기반 자바 개발자 양성과정',
    category: 'NOTICE',
    period: '2024.07.03 - 2025.01.01',
    instructor: {
      name: '윤지수',
      title: 'Magazine Education',
      email: 'magazine@naver.com',
      phone: '010-0000-0000'
    }
  };

  // 강의 자료 더미 데이터
  const courseMaterials = [
    {
      id: 1,
      title: '[AWS] 리액트 - 스토리북 - MySQL 배포 실습',
      file: '실습 파일.docx',
      date: '2024.10.01'
    },
    {
      id: 2,
      title: '[Quiz] AWS 시험',
      file: '검습 문제.pdf',
      date: '2024.10.23'
    }
  ];

  // 공지사항 더미 데이터
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
    }
  ];

  // Q&A 더미 데이터
  const qnas = [
    {
      id: 1,
      title: 'AWS EC2 접속 관련 질문입니다',
      writer: '김학생',
      date: '2024/09/13',
      status: '답변완료'
    },
    {
      id: 2,
      title: '과제 제출 방법 문의드립니다',
      writer: '이학생',
      date: '2024/09/13',
      status: '답변대기'
    }
  ];

  // 시험 및 과제 더미 데이터
  const examsAndAssignments = [
    {
      id: 1,
      type: '시험',
      title: '[Quiz] AWS 기초 이론 평가',
      writer: '윤지수',
      date: '2024/10/15',
      deadline: '2024/10/22',
      status: '진행중'
    },
    {
      id: 2,
      type: '과제',
      title: 'AWS EC2 인스턴스 생성 실습',
      writer: '윤지수',
      date: '2024/10/05',
      deadline: '2024/10/19',
      status: '제출완료'
    },
    {
      id: 3,
      type: '과제',
      title: '[AWS] 리액트 - 스토리북 - MySQL 배포 실습',
      writer: '윤지수',
      date: '2024/10/01',
      deadline: '2024/10/15',
      status: '마감'
    }
  ];

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 강의 제목 섹션 */}
        <div className="bg-white rounded-lg p-6 mb-6">
        <span className="inline-block bg-green-400 text-white px-3 py-1 rounded-full text-xs mb-4">
          {courseInfo.category}
        </span>
          <h1 className="text-2xl font-bold mb-4">{courseInfo.title}</h1>
          <p className="text-gray-500">{courseInfo.period}</p>
        </div>

        {/* 강사 정보 카드 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                  src="/api/placeholder/64/64"
                  alt="강사 프로필"
                  className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-12">이름</span>
                <span>{courseInfo.instructor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-12">E-Mail</span>
                <span>{courseInfo.instructor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-12">Phone</span>
                <span>{courseInfo.instructor.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 강의 자료 그리드 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 시험 및 과제 섹션 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-sm font-medium mb-4">시험 및 과제</h3>
            <div className="space-y-2">
              {courseMaterials.map(material => (
                  <div key={material.id} className="flex items-center space-x-2 text-sm">
                    <FileText size={16} className="text-gray-400"/>
                    <span>{material.title}</span>
                    <span className="text-gray-400 ml-auto">{material.date}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* 자료실 섹션 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-sm font-medium mb-4">자료실</h3>
            <div className="space-y-2">
              {courseMaterials.map(material => (
                  <div key={material.id} className="flex items-center space-x-2 text-sm">
                    <FileText size={16} className="text-gray-400"/>
                    <span className="text-blue-500 cursor-pointer hover:underline">{material.file}</span>
                    <span className="text-gray-400 ml-auto">{material.date}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 섹션 */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex gap-6 mb-6 border-b">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex gap-6">
                <button
                    className={`pb-2 font-medium ${
                        activeTab === 'notice'
                            ? 'text-green-500 border-b-2 border-green-500'
                            : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('notice')}
                >
                  강의 공지사항
                </button>
                <button
                    className={`pb-2 font-medium ${
                        activeTab === 'qna'
                            ? 'text-green-500 border-b-2 border-green-500'
                            : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('qna')}
                >
                  Q&A
                </button>
                <button
                    className={`pb-2 font-medium ${
                        activeTab === 'exam'
                            ? 'text-green-500 border-b-2 border-green-500'
                            : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('exam')}
                >
                  시험 및 과제
                </button>
              </div>
              {/* 전체보기 버튼 */}
              <button
                  onClick={() => {
                    switch (activeTab) {
                      case 'notice':
                        navigate('/lecturenoticelist');
                        break;
                      case 'qna':
                        navigate('/qnalist');
                        break;
                      case 'exam':
                        navigate('/exams');
                        break;
                      default:
                        break;
                    }
                  }}
                  className="text-sm text-green-500 hover:text-green-600"
              >
                전체보기
              </button>
            </div>
          </div>

          {/* 공지사항 테이블 */}
          {activeTab === 'notice' && (
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
          )}

          {/* Q&A 테이블 */}
          {activeTab === 'qna' && (
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
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${qna.status === '답변완료'
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
          )}

          {/* 시험 및 과제 테이블 */}
          {activeTab === 'exam' && (
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
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${item.type === '시험'
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
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${item.status === '진행중'
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
          )}
        </div>
      </main>
  );
};

export default CourseDetailContent;
