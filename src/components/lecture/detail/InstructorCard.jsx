import React from 'react';

const InstructorCard = ({ instructor }) => (
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
            <span>{instructor.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-12">E-Mail</span>
            <span>{instructor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-12">Phone</span>
            <span>{instructor.phoneNumber}</span>
          </div>
        </div>
      </div>
    </div>
);

export default InstructorCard;
