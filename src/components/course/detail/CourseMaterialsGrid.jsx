import React from 'react';
import AssignmentList from './AssignmentList';
import TodayArchiveList from "./archive/TodayArchiveList.jsx";

/**
 * 강의 상세 페이지의 학습 자료 그리드 컴포넌트
 */

const CourseMaterialsGrid = ({ courseId, assignments = [] }) => (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <AssignmentList assignments={assignments} />
      <TodayArchiveList courseId={courseId} />
    </div>
);

export default CourseMaterialsGrid;
