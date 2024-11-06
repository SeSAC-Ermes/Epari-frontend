import React from 'react';
import {X} from 'lucide-react';

/**
 과제 출제 미리보기 모달
 */

const PreviewModal = ({title, description, dueDate, status, onClose}) => {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">미리보기</h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
              <X size={20}/>
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">{title}</h3>
            <p className="text-gray-600 whitespace-pre-line">{description}</p>
            <div className="text-sm text-gray-500">
              <p>제출 기한: {dueDate}</p>
              <p>상태: {status}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PreviewModal;
