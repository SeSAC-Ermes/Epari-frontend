import React, { useState } from 'react';

const LectureManagementModal = ({ isOpen, onClose, lecture = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: lecture?.title || '',
    startDate: lecture?.startDate || '',
    endDate: lecture?.endDate || '',
    classroom: lecture?.classroom || ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {lecture ? '강의 수정' : '새 강의 생성'}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                강의명
              </label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                강의실
              </label>
              <input
                  type="text"
                  name="classroom"
                  value={formData.classroom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {lecture ? '수정' : '생성'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LectureManagementModal;
