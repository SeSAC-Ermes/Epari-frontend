import React from 'react';

/**
 * 재사용 가능한 탭 버튼 컴포넌트
 * 활성화 상태에 따라 스타일이 변경되며 클릭 이벤트 처리
 */

const TabButton = ({ isActive, onClick, children }) => {
  return (
      <button
          className={`pb-2 font-medium ${
              isActive
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400'
          }`}
          onClick={onClick}
      >
        {children}
      </button>
  );
};

export default TabButton;
