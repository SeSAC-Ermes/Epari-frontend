import React, { useEffect, useState } from 'react';

/**
 * 강의 생성/수정을 위한 모달 컴포넌트
 * 강의명, 시작일, 종료일, 강의실 정보를 입력받아 처리
 * 강사 권한을 가진 사용자만 접근 가능
 */

const CourseManagementModal = ({ isOpen, onClose, course = null, onSubmit }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    classroom: ''
  });

  const [error, setError] = useState('');

  // 모달이 열릴 때마다 데이터 초기화
  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        name: course.name || course.title || '',
        startDate: course.startDate ? formatDateForInput(course.startDate) : '',
        endDate: course.endDate ? formatDateForInput(course.endDate) : '',
        classroom: course.classroom || ''
      });
    } else if (isOpen && !course) {
      // 새로운 강의 생성 시 폼 초기화
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        classroom: ''
      });
    }
    setError(''); // 에러 메시지 초기화
  }, [isOpen, course]);

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };

      // 날짜 필드가 변경될 때 유효성 검사
      if (name === 'startDate' || name === 'endDate') {
        if (!validateDates(newFormData.startDate, newFormData.endDate)) {
          setError('종료일은 시작일보다 빠를 수 없습니다.');
        } else {
          setError('');
        }
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 최종 제출 시 날짜 유효성 검사
    if (!validateDates(formData.startDate, formData.endDate)) {
      setError('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {course ? '강의 수정' : '새 강의 생성'}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
          )}

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
                  min={formData.startDate} // 시작일 이전 날짜 선택 방지
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
                  disabled={!!error}
                  className={`px-4 py-2 text-sm text-white rounded-md ${
                      error
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600'
                  }`}
              >
                {course ? '수정' : '생성'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CourseManagementModal;
