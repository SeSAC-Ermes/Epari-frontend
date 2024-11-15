import React from 'react';
import StudentManagementContent from '../../components/student/StudentManagementContent.jsx';

/**
 * 수강생 관리를 위한 페이지 컴포넌트
 * 강사가 학생들의 출석, 과제, 시험 현황을 종합적으로 관리할 수 있는 페이지
 */

const StudentManagementPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <StudentManagementContent />
      </div>
  );
};

export default StudentManagementPage;
