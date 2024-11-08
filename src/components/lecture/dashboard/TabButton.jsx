import React from 'react';

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
