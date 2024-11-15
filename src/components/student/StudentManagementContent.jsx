import React, { useState } from 'react';
import StudentSearchBar from "./StudentSearchBar.jsx";
import StudentCard from "./StudentCard.jsx";

/**
 * 수강생 관리 페이지의 메인 컨텐츠 컴포넌트
 * 학생 검색 및 학생별 상세 정보를 관리
 */

const StudentManagementContent = () => {
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 예시 데이터 - 실제로는 API에서 가져와야 함
  const students = [
    {
      id: 1,
      name: "김학생",
      email: "student1@sesac.com",
      attendance: {
        present: 12,
        late: 2,
        sick: 1,
        absent: 1,
        total: 16,
        rate: "93%"
      },
      grades: {
        exams: 88
      },
      submissions: {
        assignments: [
          {
            id: 1,
            title: "AWS EC2 인스턴스 생성 실습",
            status: "PASS",
            submittedAt: "2024-03-10",
            feedback: "코드 품질이 우수하며 문서화가 잘 되어있습니다."
          },
          {
            id: 2,
            title: "RDS 데이터베이스 구축 실습",
            status: "NON_PASS",
            submittedAt: "2024-03-15",
            feedback: "보안 그룹 설정이 미흡합니다. 수정 후 재제출해주세요."
          }
        ],
        exams: [
          { id: 1, title: "중간고사", score: 88, date: "2024-03-20" }
        ]
      }
    },
    // ... 다른 학생 데이터
  ];

  const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">수강생 관리</h1>
            <StudentSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
          </div>

          <div className="space-y-4">
            {filteredStudents.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    isExpanded={expandedStudent === student.id}
                    onToggle={() => setExpandedStudent(
                        expandedStudent === student.id ? null : student.id
                    )}
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default StudentManagementContent;
