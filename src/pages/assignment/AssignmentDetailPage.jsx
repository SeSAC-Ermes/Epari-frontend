import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, Trash2 } from 'lucide-react';
import QuillEditor from "../../components/common/QuillEditor.jsx";
import { AssignmentHeader } from '../../components/assignment/AssignmentHeader';
import { AssignmentAPI } from '../../api/assignment/AssignmentApi';
import { AssignmentFileApi } from "../../api/assignment/AssignmentFileApi.js";
import { formatDate } from "../../utils/DateUtils.js";
import FileUpload from '../../components/common/FileUpload';
import { SubmissionFileApi } from "../../api/assignment/SubmissionFileApi.js";
import { useSubmission } from "../../components/assignment/hooks/useSubmission.js";
import 'react-quill/dist/quill.snow.css';
import { withPageAuth } from "../../auth/WithAuth.jsx";

const AssignmentDetailPage = () => {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);

  const {
    submission,
    description,
    setDescription,
    isSubmitting,
    error,
    isLoading,
    existingFiles,
    handleSubmit,
    handleFileDelete,
    handleFilesChange
  } = useSubmission(courseId, assignmentId);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [courseId, assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      const data = await AssignmentAPI.getAssignmentById(courseId, assignmentId);
      setAssignment(data);
    } catch (err) {
      console.error('과제 정보를 불러오는데 실패했습니다.', err);
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      if (!submission) return;

      const downloadUrl = await SubmissionFileApi.getFileDownloadUrl(
          courseId,
          assignmentId,
          submission.id,
          fileId
      );

      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleAssignmentFileDownload = async (fileId, fileName) => {
    try {
      const downloadUrl = await AssignmentFileApi.getFileDownloadUrl(courseId, assignmentId, fileId);

      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const isDeadlinePassed = () => {
    if (!assignment) return false;
    const deadline = new Date(assignment.deadline);
    const now = new Date();
    return deadline < now;
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );
  }

  const deadlinePassed = isDeadlinePassed();

  return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
          )}

          {assignment && (
              <div className="space-y-6">
                <AssignmentHeader
                    date={formatDate(assignment.createdAt)}
                    title={assignment.title}
                    deadline={assignment.deadline}
                />

                <div>
                  <h2 className="text-lg mb-4">과제안내</h2>
                  <div className="bg-white rounded-lg p-6">
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: assignment.description || '' }}
                    />

                    {assignment?.files?.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h3 className="font-medium mb-3 text-gray-700">첨부파일</h3>
                          <div className="space-y-2">
                            {assignment.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-gray-500"/>
                                    <span className="text-sm text-gray-600">
                              {file.originalFileName}
                            </span>
                                  </div>
                                  <button
                                      onClick={() => handleAssignmentFileDownload(file.id, file.originalFileName)}
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
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">
                        {deadlinePassed ? '제출한 과제' : (submission ? '과제 수정' : '과제 제출')}
                      </h2>
                      {submission?.grade && (
                          <div className="flex items-center gap-4">
                      <span className={`font-medium ${
                          submission.grade === '통과' ? 'text-blue-600' :
                              submission.grade === '미통과' ? 'text-red-600' :
                                  'text-yellow-600'}`}>
                          성적: {submission.grade}
                      </span>
                            {submission.updatedAt && (
                                <span className="text-gray-500 text-sm">
                          최종 수정일: {formatDate(submission.updatedAt)}
                        </span>
                            )}
                          </div>
                      )}
                    </div>
                    <div className="rounded-lg">
                      <QuillEditor
                          value={description}
                          onChange={setDescription}
                          readOnly={deadlinePassed}
                      />
                    </div>
                  </div>

                  {submission?.feedback && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">교수 피드백</h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          {submission.feedback}
                        </div>
                      </div>
                  )}

                  <div className="space-y-4">
                    {existingFiles.length > 0 && (
                        <div className="border rounded-lg p-4 space-y-4">
                          <label className="block text-sm font-medium text-gray-700">
                            {deadlinePassed ? '제출한 파일' : '기존 첨부파일'}
                          </label>
                          <div className="space-y-2">
                            {existingFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-gray-500"/>
                                    <span className="text-sm text-gray-600">
                              {file.originalFileName}
                            </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleFileDownload(file.id, file.originalFileName)}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                      <Download size={16} className="text-gray-600"/>
                                    </button>
                                    {!deadlinePassed && (
                                        <button
                                            type="button"
                                            onClick={() => handleFileDelete(file.id)}  // 직접 호출
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                          <Trash2 size={16} className="text-red-500"/>
                                        </button>
                                    )}
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {!deadlinePassed && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              새 파일 첨부
                            </label>
                            <FileUpload
                                onFilesChange={handleFilesChange}
                                showFileList={false}
                            />
                          </div>

                          <div className="flex justify-end pb-8">
                            <button
                                type="submit"
                                className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                              {isSubmitting ? '처리 중...' : (submission ? '과제 수정하기' : '과제 제출하기')}
                            </button>
                          </div>
                        </form>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default withPageAuth(AssignmentDetailPage, 'ASSIGNMENT_DETAIL');
