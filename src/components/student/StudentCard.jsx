import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AttendanceSection from './AttendanceSection';
import ExamSection from './ExamSection';
import AssignmentSection from './AssignmentSection';
import { ExamAPI } from '../../api/exam/examAPI';

const StudentCard = ({ student, isExpanded, onToggle }) => {
  const [examAverage, setExamAverage] = useState(0);

  useEffect(() => {
    const fetchExamAverage = async () => {
      try {
        const data = await ExamAPI.getStudentExamResults(student.id);
        setExamAverage(data.averageScore || 0);
      } catch (err) {
        console.error('시험 평균 조회 실패:', err);
      }
    };

    fetchExamAverage();
  }, [student.id]);

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
              <p className="font-medium">{examAverage.toFixed(1)}점</p>
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
                <ExamSection studentId={student.id}/>
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
