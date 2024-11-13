import React from 'react';
import { FileText } from 'lucide-react';

/**
 * 강의 상세 페이지의 시험 및 과제 목록을 표시하는 컴포넌트
 */

const AssignmentList = ({ assignments = [] }) => (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-sm font-medium mb-4">시험 및 과제</h3>
      <div className="space-y-2">
        {assignments?.length > 0 ? (
            assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center space-x-2 text-sm">
                  <FileText size={16} className="text-gray-400"/>
                  <span>{assignment.title}</span>
                  <span className="text-gray-400 ml-auto">{assignment.date}</span>
                </div>
            ))
        ) : (
            <div className="text-sm text-gray-500">등록된 시험/과제가 없습니다.</div>
        )}
      </div>
    </div>
);

export default AssignmentList;
