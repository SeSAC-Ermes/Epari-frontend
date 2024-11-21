import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, FileText, Pencil, Trash2 } from 'lucide-react';
import QuillEditor from '../../components/common/QuillEditor';
import FileUpload from "../../components/common/FileUpload";
import courseAPI from "../../api/course/courseAPI.js";
import { calculateDday, formatDate, getAssignmentStatus } from "../../utils/DateUtils.js";
import { useAssignmentActions, useAssignmentState, useAuth, useFileHandling } from './hooks/useAssignment';
import { SubmissionApi } from "../../api/assignment/SubmissionApi.js";

const AssignmentDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState({});

  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const today = formatDateForInput(new Date());

  // Custom hooks 사용
  const state = useAssignmentState();
  const { fetchAssignments, handleUpdateSubmit, handleCancelEdit, handleDeleteAssignment } =
      useAssignmentActions(courseId, state, state);
  const { getIsInstructorFromToken } = useAuth();
  const { handleDownloadFile, handleDeleteFile, handleFilesChange } = useFileHandling(courseId);

  const handleCreateClick = () => {
    navigate(`/courses/${courseId}/assignments/create`);
  };

  const handleEdit = (assignment) => {
    state.setEditingId(assignment.id);
    state.setExpandedId(assignment.id);
    state.setEditTitle(assignment.title);
    state.setEditContent(assignment.description);
    state.setEditDueDate(assignment.deadline?.split('T')[0] || '');
    state.setExistingFiles(assignment.files || []);
    state.setFiles([]);
    state.setFilesToRemove([]);
  };

  const fetchSubmissionStatus = async (assignmentId) => {
    try {
      if (state.isInstructor) {
        return;
      }
      const submission = await SubmissionApi.getSubmissionById(courseId, assignmentId);
      if (submission) {
        setSubmission(prev => ({
          ...prev,
          [assignmentId]: submission
        }));
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  useEffect(() => {
    if (state.assignments?.length > 0) {
      state.assignments.forEach(assignment => {
        fetchSubmissionStatus(assignment.id);
      });
    }
  }, [state.assignments]);

  useEffect(() => {
    fetchAssignments();
    const checkInstructorStatus = () => {
      const instructorStatus = getIsInstructorFromToken();
      state.setIsInstructor(instructorStatus);
    };

    const fetchCourseInfo = async () => {
      try {
        const courseResponse = await courseAPI.getCourseDetail(courseId);
        if (courseResponse.instructor) {
          state.setInstructorId(courseResponse.instructor.id);
        } else {
          state.setError('강의 담당 강사 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        state.setError('강의 정보를 불러오는데 실패했습니다.');
      }
    };

    checkInstructorStatus();
    fetchCourseInfo();
  }, [courseId]);

  if (state.isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );
  }

  const getSubmissionStatusStyle = (status) => {
    switch (status) {
      case '제출완료':
        return 'bg-blue-100 text-blue-700';
      case '채점완료':
        return 'bg-green-100 text-green-700';
      case '미제출':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubmissionStatusText = (status) => status || '미제출';

  return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-gray-900">과제</h1>
            {state.isInstructor && (
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  출제하기
                </button>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              {state.isInstructor ? (
                  <>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">No.</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">작성자</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제출기한</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.assignments.map((assignment, index) => (
                          <React.Fragment key={assignment.id}>
                            <tr className="hover:bg-gray-50 border-b border-gray-200 last:border-0">
                              <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate(`/courses/${courseId}/assignments/${assignment.id}/submissions`);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                                >
                                  {assignment.title}
                                </button>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{assignment.instructor?.name}</td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600">
                                  {formatDate(assignment.deadline)}
                                </div>
                                <div className="mt-1">
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${calculateDday(assignment.deadline).class}`}>
                              {calculateDday(assignment.deadline).text}
                            </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                          <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatus(assignment.deadline).class}`}>
                            {getAssignmentStatus(assignment.deadline).text}
                          </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                      onClick={() => handleEdit(assignment)}
                                      className="p-1 hover:bg-gray-100 rounded-full"
                                  >
                                    <Pencil size={16} className="text-gray-600"/>
                                  </button>
                                  <button
                                      onClick={() => handleDeleteAssignment(assignment.id)}
                                      className="p-1 hover:bg-gray-100 rounded-full"
                                  >
                                    <Trash2 size={16} className="text-red-500"/>
                                  </button>
                                  <button
                                      onClick={() => state.setExpandedId(state.expandedId === assignment.id ? null : assignment.id)}
                                      className="p-1 hover:bg-gray-100 rounded-full"
                                  >
                                    {state.expandedId === assignment.id ? <ChevronUp size={16}/> :
                                        <ChevronDown size={16}/>}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {state.expandedId === assignment.id && (
                                <tr>
                                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                    {state.editingId === assignment.id ? (
                                        <form onSubmit={(e) => handleUpdateSubmit(e, assignment.id)}
                                              className="space-y-6">
                                          <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">제목</label>
                                            <input
                                                type="text"
                                                value={state.editTitle}
                                                onChange={(e) => state.setEditTitle(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">내용</label>
                                            <div className="rounded-lg">
                                              <QuillEditor
                                                  value={state.editContent}
                                                  onChange={state.setEditContent}
                                                  readOnly={false}
                                              />
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">제출 기한</label>
                                            <input
                                                type="date"
                                                value={state.editDueDate}
                                                onChange={(e) => state.setEditDueDate(e.target.value)}
                                                min={today}  // 최소 날짜를 오늘로 설정
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            />
                                            {state.editDueDate && state.editDueDate < today && (
                                                <p className="text-red-500 text-sm mt-1">
                                                  마감일은 현재 날짜보다 이후여야 합니다.
                                                </p>
                                            )}
                                          </div>

                                          <div className="space-y-4">
                                            {state.existingFiles.length > 0 && (
                                                <div className="border rounded-lg p-4 space-y-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    기존 첨부파일
                                                  </label>
                                                  <div className="space-y-2">
                                                    {state.existingFiles.map((file) => (
                                                        <div key={file.id}
                                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                          <div className="flex items-center gap-3">
                                                            <FileText size={20} className="text-gray-500"/>
                                                            <span className="text-sm text-gray-600">
                                                {file.originalFileName}
                                              </span>
                                                          </div>
                                                          <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleDownloadFile(assignment.id, file.id, file.originalFileName)}
                                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                                type="button"
                                                            >
                                                              <Download size={16} className="text-gray-600"/>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteFile(file.id, state)}
                                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                                type="button"
                                                            >
                                                              <Trash2 size={16} className="text-red-500"/>
                                                            </button>
                                                          </div>
                                                        </div>
                                                    ))}
                                                  </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                              <label className="block text-sm font-medium text-gray-700">
                                                새 파일 첨부
                                              </label>
                                              <FileUpload
                                                  onFilesChange={(files) => handleFilesChange(files, state)}
                                                  showFileList={false}
                                              />


                                            </div>
                                          </div>

                                          <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                disabled={state.isSubmitting}
                                            >
                                              취소
                                            </button>
                                            <button
                                                type="submit"
                                                className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                    ${state.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={state.isSubmitting}
                                            >
                                              {state.isSubmitting ? '수정 중...' : '수정'}
                                            </button>
                                          </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                          <div
                                              className="prose max-w-none"
                                              dangerouslySetInnerHTML={{ __html: assignment.description }}
                                          />
                                          {assignment.files?.length > 0 && (
                                              <div className="mt-4 pt-4 border-t">
                                              <h3 className="font-medium mb-3 text-gray-700">첨부파일</h3>
                                                <div className="space-y-2">
                                                  {assignment.files.map((file) => (
                                                      <div key={file.id}
                                                           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                          <FileText size={20} className="text-gray-500"/>
                                                          <span className="text-sm text-gray-600">
                                              {file.originalFileName}
                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadFile(assignment.id, file.id, file.originalFileName)}
                                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                        >
                                                          <Download size={16} className="text-gray-600"/>
                                                        </button>
                                                      </div>
                                                  ))}
                                                </div>
                                              </div>
                                          )}
                                        </div>
                                    )}
                                  </td>
                                </tr>
                            )}
                          </React.Fragment>
                      ))}
                    </tbody>
                  </>
              ) : (
                  <>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">No.</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">출제 일자</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">작성자</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제출 마감일자</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제출 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.assignments.map((assignment, index) => (
                          <tr
                              key={assignment.id}
                              className="hover:bg-gray-50 border-b border-gray-200 last:border-0 cursor-pointer"
                              onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                          >
                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(assignment.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                        <span className="text-sm text-blue-600 hover:text-blue-800">
                          {assignment.title}
                        </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {assignment.instructor?.name}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {formatDate(assignment.deadline)}
                              </div>
                              <div className="mt-1">
                          <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${calculateDday(assignment.deadline).class}`}
                          >
                            {calculateDday(assignment.deadline).text}
                          </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getSubmissionStatusStyle(submission[assignment.id]?.status)}`}
                        >
                          {getSubmissionStatusText(submission[assignment.id]?.status)}
                        </span>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </>
              )}
            </table>

            {state.assignments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  등록된 과제가 없습니다.
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AssignmentDetail;
