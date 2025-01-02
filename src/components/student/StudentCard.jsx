import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExamSection from './ExamSection';
import AssignmentSection from './AssignmentSection';

const StudentCard = ({ student, examResult, isExpanded, onToggle, courseId }) => {
  const navigate = useNavigate();

  const handleAttendanceClick = (e) => {
    e.stopPropagation(); // 카드 토글 방지
    // 출석 관리 페이지로 이동하면서 학생 이름을 검색어로 전달
    navigate(`/courses/${courseId}/attendance`, {
      state: { searchQuery: student.name }
    });
  };

  return (
      <div className="bg-white rounded-lg shadow">
        <div
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={onToggle}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {student.profileFileUrl ? (
                  <img
                      src={student.profileFileUrl}
                      alt={`${student.name}의 프로필`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/64/64";
                      }}
                  />
              ) : (
                  <span className="text-gray-400 font-semibold">
      {student.name[0].toUpperCase()}
    </span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{student.name}</h3>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">출석률</p>
              <p className="font-medium">{student.attendance.rate}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">평균 점수</p>
              <p className="font-medium">
                {examResult ? `${examResult.averageScore}점` : '없음'}
              </p>
            </div>
            {isExpanded ? (
                <ChevronUp size={20} className="text-gray-400"/>
            ) : (
                <ChevronDown size={20} className="text-gray-400"/>
            )}
          </div>
        </div>

        {isExpanded && (
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  {/* 출석 현황 텍스트를 클릭 가능한 버튼으로 변경 */}
                  <h4 className="font-medium mb-4 flex items-center">
                    <button
                        onClick={handleAttendanceClick}
                        className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                    >
                      출석 현황
                    </button>
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">출석</p>
                      <p className="text-xl font-medium text-green-600">
                        {student.attendance.present}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">지각</p>
                      <p className="text-xl font-medium text-yellow-600">
                        {student.attendance.late}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">병가</p>
                      <p className="text-xl font-medium text-purple-600">
                        {student.attendance.sick}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">결석</p>
                      <p className="text-xl font-medium text-red-600">
                        {student.attendance.absent}
                      </p>
                    </div>
                  </div>
                </div>
                <ExamSection
                    exams={examResult?.examResults || []}
                    loading={false}
                    error={null}
                />
                <AssignmentSection
                    courseId={courseId}
                    student={student}
                    className="col-span-2"
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default StudentCard;
