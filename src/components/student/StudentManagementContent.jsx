import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentSearchBar from "./StudentSearchBar.jsx";
import StudentCard from "./StudentCard.jsx";
import { AttendanceAPI } from "../../api/attendance/attendanceAPI.js";

/**
 * 수강생 관리 페이지의 메인 컨텐츠 컴포넌트
 * 학생 검색 및 학생별 상세 정보를 관리
 */

const StudentManagementContent = () => {
  const { courseId } = useParams();
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // 출석 통계 데이터 가져오기
        const statsData = await AttendanceAPI.getAttendanceStats(courseId);

        // 통계 데이터를 학생 정보와 통합
        const formattedStudents = statsData.map(stat => ({
          id: stat.student.id,
          name: stat.student.name,
          email: stat.student.email,
          attendance: {
            present: stat.counts.presentCount,
            late: stat.counts.lateCount,
            sick: stat.counts.sickLeaveCount,
            absent: stat.counts.absentCount,
            rate: `${Math.round(stat.counts.attendanceRate)}%`
          },
          // 더미 데이터로 유지할 부분
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
        }));

        setStudents(formattedStudents);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('학생 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [courseId]);

  const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"/>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          </div>
        </div>
    );
  }

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

            {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  검색 결과가 없습니다.
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default StudentManagementContent;
