import React, { useEffect, useState } from 'react';
import AttendanceStatusSection from './AttendanceStatusSection.jsx';
import Sidebar from "../../components/layout/Sidebar.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import AttendanceTable from "./AttendanceTable.jsx";
import { useParams } from "react-router-dom";
import apiClient from "../../api/axios.js";
import { withPageAuth } from '../../auth/WithAuth.jsx';

/**
 * 출석부 관리를 위한 메인 페이지 컴포넌트
 * 출석 상태 변경, 저장 및 통계 기능 제공
 */
const AttendanceManagementPage = () => {
  const { courseId } = useParams();

  // 상태 관리
  const [students, setStudents] = useState([]);
  const [modifiedStudents, setModifiedStudents] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    sick: 0,
    absent: 0
  });
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // API 호출 함수들
  const fetchAttendances = async (date) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(`/api/instructor/courses/${courseId}/attendances`, {
        params: { date }
      });

      // API 응답 데이터를 프론트엔드 형식으로 변환
      const formattedData = data.map((item, index) => ({
        no: index + 1,
        studentId: item.studentId, // API 응답에서 학생 ID 추가
        name: item.name,
        status: item.status
      }));

      setStudents(formattedData);
      updateStats(formattedData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '출석 정보를 불러오는데 실패했습니다.';
      showToastMessage('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAttendances = async () => {
    try {
      setIsLoading(true);

      // 변경된 데이터만 필터링하여 API 요청 형식으로 변환
      const updateData = students
          .filter(student => modifiedStudents.has(student.no))
          .map(student => ({
            studentId: student.studentId,
            status: convertStatusToEnum(student.status)
          }));

      await apiClient.patch(
          `/api/instructor/courses/${courseId}/attendances`,
          updateData,
          { params: { date: currentDate } }
      );

      setModifiedStudents(new Set());
      showToastMessage('success', '출석 정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '출석 정보 저장 중 오류가 발생했습니다.';
      showToastMessage('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 출석 상태를 백엔드 enum 형식으로 변환
  const convertStatusToEnum = (status) => {
    const statusMap = {
      '출석': 'PRESENT',
      '지각': 'LATE',
      '결석': 'ABSENT',
      '병결': 'SICK_LEAVE'
    };
    return statusMap[status];
  };

  // 토스트 메시지 표시 함수
  const showToastMessage = (type, message) => {
    setToastMessage({ type, message });
    setShowToast(true);
  };

  // 통계 업데이트
  const updateStats = (studentList) => {
    setStats({
      total: studentList.length,
      present: studentList.filter(s => s.status === '출석').length,
      late: studentList.filter(s => s.status === '지각').length,
      sick: studentList.filter(s => s.status === '병결').length,
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

  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
    fetchAttendances(e.target.value);
  };

  // 변경사항 초기화
  const resetChanges = async () => {
    await fetchAttendances(currentDate);
    setModifiedStudents(new Set());
    setShowUnsavedDialog(false);
  };

  // 토스트 메시지 자동 제거
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

  // 초기 데이터 로드
  useEffect(() => {
    fetchAttendances(currentDate);
  }, [courseId]);

  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="flex-1">
          <TopBar/>
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
              {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                  </div>
              ) : (
                  <>
                    <AttendanceStatusSection
                        stats={stats}
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                    />
                    <AttendanceTable
                        students={students}
                        onStudentStatusChange={handleStudentStatusChange}
                    />
                  </>
              )}

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
                        onClick={saveAttendances}
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

export default withPageAuth(AttendanceManagementPage, 'ATTENDANCE_MANAGEMENT');
