import React from 'react';

/**
 * 강사 정보를 카드 형태로 표시하는 컴포넌트
 * 강사의 프로필 이미지, 이름, 이메일, 전화번호 정보를 표시
 */

const InstructorCard = ({ instructor }) => {
  // instructor가 없는 경우 처리
  if (!instructor) {
    return (
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="text-gray-500">강사 정보를 불러올 수 없습니다.</p>
        </div>
    );
  }

  return (
      <div className="p-6 mb-6">
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
              <span>{instructor.name || '정보 없음'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-12">E-Mail</span>
              <span>{instructor.email || '정보 없음'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-12">Phone</span>
              <span>{instructor.phoneNumber || instructor.phone || '정보 없음'}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default InstructorCard;
