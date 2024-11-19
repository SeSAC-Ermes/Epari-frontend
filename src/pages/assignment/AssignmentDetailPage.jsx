import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, FileText, Trash2 } from 'lucide-react';
import QuillEditor from "../../components/common/QuillEditor.jsx";
import { AssignmentHeader } from '../../components/assignment/AssignmentHeader';
import { AssignmentAPI } from '../../api/assignment/AssignmentApi';
import { SubmissionApi } from '../../api/assignment/SubmissionApi';
import { formatDate } from "../../utils/DateUtils.js";
import FileUpload from '../../components/common/FileUpload';
import 'react-quill/dist/quill.snow.css';

const AssignmentDetailPage = () => {
  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams();

  // 기본 상태
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 파일 관련 상태
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    fetchAssignmentDetails();
    fetchSubmission();
  }, [courseId, assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      const data = await AssignmentAPI.getAssignmentById(courseId, assignmentId);
      setAssignment(data);
    } catch (err) {
      setError('과제 정보를 불러오는데 실패했습니다.');
    }
  };

  const fetchSubmission = async () => {
    try {
      const data = await SubmissionApi.getSubmissionById(courseId, assignmentId);
      if (data) {
        setSubmission(data);
        setDescription(data.content || '');
        if (data.files) {
          setExistingFiles(data.files);
        }
      }
    } catch (err) {
      console.log('No submission found');
    } finally {
      setIsLoading(false);
    }
  };

  const isDeadlinePassed = () => {
    if (!assignment) return false;
    return new Date(assignment.deadline) < new Date();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 먼저 삭제할 파일들을 처리
      for (const fileId of filesToRemove) {
        await SubmissionApi.deleteSubmissionFile(
            courseId,
            assignmentId,
            submission.id,
            fileId
        );
      }

      const submissionData = {
        content: description,
        files: newFiles
      };

      if (submission) {
        // 수정
        await SubmissionApi.updateSubmission(
            courseId,
            assignmentId,
            submission.id,
            submissionData
        );
        alert('과제가 성공적으로 수정되었습니다.');
      } else {
        // 새로운 제출
        await SubmissionApi.createSubmission(
            courseId,
            assignmentId,
            submissionData
        );
        alert('과제가 성공적으로 제출되었습니다.');
      }

      // 상태 초기화 및 새로고침
      setFilesToRemove([]);
      setNewFiles([]);
      fetchSubmission();
    } catch (err) {
      setError(err.response?.data?.message || '과제 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDelete = async (fileId) => {
    setFilesToRemove(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleNewFileDelete = (index) => {
    setNewFiles(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const presignedUrl = await SubmissionApi.downloadSubmissionFile(
          courseId,
          assignmentId,
          submission.id,
          fileId
      );
      window.open(presignedUrl, '_blank');
    } catch (err) {
      setError('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleFilesChange = (files) => {
    setNewFiles(files);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <AssignmentHeader
                    date={formatDate(assignment.createdAt)}
                    title={assignment.title}
                    deadline={assignment.deadline}
                />

                <div>
                  <h2 className="text-lg mb-4">과제안내</h2>
                  <div className="bg-white rounded-lg p-6">
                    <div className="prose max-w-none"
                         dangerouslySetInnerHTML={{ __html: assignment.description || '' }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium">
                      과제 {submission ? '수정' : '제출'}
                      {submission?.grade &&
                          <span className="ml-4 text-blue-600">
                      점수: {submission.grade}
                    </span>
                      }
                    </h2>
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
                        <h3 className="text-lg font-medium">교수자 피드백</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {submission.feedback}
                        </div>
                      </div>
                  )}

                  <div className="space-y-4">
                    {existingFiles.length > 0 && (
                        <div className="border rounded-lg p-4 space-y-4">
                          <label className="block text-sm font-medium text-gray-700">
                            기존 첨부파일
                          </label>
                          <div className="space-y-2">
                            {existingFiles.map((file) => (
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
                                        type="button"
                                        onClick={() => handleFileDownload(file.id, file.originalFileName)}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                      <Download size={16} className="text-gray-600"/>
                                    </button>
                                    {!deadlinePassed && (
                                        <button
                                            type="button"
                                            onClick={() => handleFileDelete(file.id)}
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
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            새 파일 첨부
                          </label>
                          <FileUpload
                              onFilesChange={handleFilesChange}
                              showFileList={false}
                          />

                          {newFiles.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {newFiles.map((file, index) => (
                                    <div key={index}
                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-gray-500"/>
                                        <span className="text-sm text-gray-600">
                                {file.name}
                              </span>
                                      </div>
                                      <button
                                          type="button"
                                          onClick={() => handleNewFileDelete(index)}
                                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                      >
                                        <Trash2 size={16} className="text-red-500"/>
                                      </button>
                                    </div>
                                ))}
                              </div>
                          )}
                        </div>
                    )}
                  </div>

                  {!deadlinePassed && (
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
                  )}
                </div>
              </form>
          )}
        </div>
      </div>
  );
};

export default AssignmentDetailPage;
