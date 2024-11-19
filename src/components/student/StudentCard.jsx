import React from 'react'; // useEffect, useState 제거
import { ChevronDown, ChevronUp } from 'lucide-react';
import AttendanceSection from './AttendanceSection';
import ExamSection from './ExamSection';
import AssignmentSection from './AssignmentSection';

/**
 * 개별 학생의 정보를 카드 형태로 표시하는 컴포넌트
 * 학생의 기본 정보와 확장 시 상세 정보를 표시
 */
const StudentCard = ({ student, examResult, isExpanded, onToggle }) => {
  return (
      <div className="bg-white rounded-lg shadow">
        <div
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={onToggle}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {student.name[0]}
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
                <AttendanceSection attendance={student.attendance}/>
                <ExamSection
                    exams={examResult?.examResults || []}
                    loading={false}  // 부모로부터 받은 데이터를 사용하므로 항상 false
                    error={null}     // 부모로부터 받은 데이터를 사용하므로 항상 null
                />
                <AssignmentSection
                    assignments={student.submissions.assignments}
                    className="col-span-2"
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default StudentCard;
