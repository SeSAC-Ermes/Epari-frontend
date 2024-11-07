import React, { useEffect, useState } from 'react';
import AttendanceStatusSection from './AttendanceStatusSection';
import Sidebar from "../../components/layout/Sidebar.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import AttendanceTable from "./AttendanceTable.jsx";

/**
 * 출석부 관리를 위한 메인 페이지 컴포넌트
 * 출석 상태 변경, 저장 및 통계 기능 제공
 */
const AttendanceManagementPage = () => {
  // 초기 학생 데이터
  const initialStudents = [
    { no: 1, name: '김경환', status: '출석' },
    { no: 2, name: '박은화', status: '출석' },
    { no: 3, name: '박종호', status: '출석' },
    { no: 4, name: '성기범', status: '출석' },
    { no: 5, name: '신동진', status: '병가' },
    { no: 6, name: '오승찬', status: '출석' },
    { no: 7, name: '오찬근', status: '결석' },
    { no: 8, name: '이한나', status: '출석' },
    { no: 9, name: '임진희', status: '출석' },
    { no: 10, name: '임혜린', status: '출석' },
    { no: 11, name: '정진욱', status: '출석' },
    { no: 12, name: '홍인표', status: '출석' },
    { no: 13, name: '황신욱', status: '출석' },
  ];

  // 상태 관리
  const [students, setStudents] = useState(initialStudents);
  const [modifiedStudents, setModifiedStudents] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [stats, setStats] = useState({
    total: initialStudents.length,
    present: initialStudents.filter(s => s.status === '출석').length,
    late: initialStudents.filter(s => s.status === '지각').length,
    sick: initialStudents.filter(s => s.status === '병가').length,
    absent: initialStudents.filter(s => s.status === '결석').length,
  });

  // 토스트 메시지 처리
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (modifiedStudents.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [modifiedStudents]);

  // 통계 업데이트
  const updateStats = (studentList) => {
    setStats({
      total: studentList.length,
      present: studentList.filter(s => s.status === '출석').length,
      late: studentList.filter(s => s.status === '지각').length,
      sick: studentList.filter(s => s.status === '병가').length,
      absent: studentList.filter(s => s.status === '결석').length,
    });
  };

  // 학생 상태 변경 핸들러
  const handleStudentStatusChange = (updatedStudent) => {
    setStudents(prev => {
      const newStudents = prev.map(student =>
          student.no === updatedStudent.no ? updatedStudent : student
      );
      updateStats(newStudents);
      return newStudents;
    });
    setModifiedStudents(prev => new Set(prev).add(updatedStudent.no));
  };

  // 변경사항 저장
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const modifiedData = students.filter(student =>
          modifiedStudents.has(student.no)
      );

      // TODO: API 연동 후 실제 호출로 변경
      // await api.updateAttendance(modifiedData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

      setModifiedStudents(new Set());
      setToastMessage({ type: 'success', message: '출석 정보가 성공적으로 저장되었습니다.' });
      setShowToast(true);
    } catch (error) {
      setToastMessage({ type: 'error', message: '출석 정보 저장 중 오류가 발생했습니다.' });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 변경사항 초기화
  const resetChanges = () => {
    setStudents(initialStudents);
    setModifiedStudents(new Set());
    updateStats(initialStudents);
    setShowUnsavedDialog(false);
  };

  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="flex-1">
          <TopBar/>
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
              <AttendanceStatusSection stats={stats}/>
              <AttendanceTable
                  students={students}
                  onStudentStatusChange={handleStudentStatusChange}
              />

              {/* 토스트 메시지 */}
              {showToast && (
                  <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 
                ${toastMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    <div className="flex items-center space-x-2">
                      {toastMessage.type === 'success' ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" strokeLinecap="round"
                               strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                      ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round"
                               strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      )}
                      <span className="font-medium">{toastMessage.message}</span>
                    </div>
                  </div>
              )}

              {/* 변경사항 저장/취소 버튼 */}
              {modifiedStudents.size > 0 && (
                  <div
                      className="fixed bottom-4 right-4 flex gap-3 items-center backdrop-blur-sm bg-white/30 px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {modifiedStudents.size}개의 변경사항
                </span>
                    <button
                        onClick={() => setShowUnsavedDialog(true)}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                    >
                      취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      {isLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                      strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            저장 중
                          </>
                      ) : '변경사항 저장'}
                    </button>
                  </div>
              )}

              {/* 변경사항 취소 확인 모달 */}
              {showUnsavedDialog && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        변경사항 취소
                      </h3>
                      <p className="text-gray-500">
                        저장하지 않은 변경사항이 있습니다. 정말로 취소하시겠습니까?
                        취소된 변경사항은 복구할 수 없습니다.
                      </p>
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowUnsavedDialog(false)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          돌아가기
                        </button>
                        <button
                            onClick={resetChanges}
                            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                        >
                          변경사항 취소
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default AttendanceManagementPage;
