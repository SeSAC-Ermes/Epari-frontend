import React from 'react';
import { Check, X } from 'lucide-react';

const AssignmentSection = ({ assignments, className }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
        return 'text-green-600 bg-green-50';
      case 'NON_PASS':
        return 'text-red-600 bg-red-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <Check size={16} className="text-green-600" />;
      case 'NON_PASS':
        return <X size={16} className="text-red-600" />;
      case 'PENDING':
        return <div className="w-4 h-4 rounded-full bg-yellow-200" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PASS':
        return 'Pass';
      case 'NON_PASS':
        return 'Non-Pass';
      case 'PENDING':
        return '평가중';
      default:
        return status;
    }
  };

  return (
      <div className={className}>
        <h4 className="font-medium mb-4">과제 제출 현황</h4>
        <div className="space-y-3">
          {assignments.map(assignment => (
              <div key={assignment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <h5 className="font-medium">{assignment.title}</h5>
                    <p className="text-sm text-gray-500">제출일: {assignment.submittedAt}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    <span className="text-sm font-medium">
                  {getStatusText(assignment.status)}
                </span>
                  </div>
                </div>
                {assignment.feedback && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded">
                      <p className="font-medium mb-1">피드백</p>
                      {assignment.feedback}
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default AssignmentSection;
