import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Download, XCircle, FileText } from 'lucide-react';
import { SubmissionApi } from "../../api/assignment/SubmissionApi.js";
import { formatDate } from "../../utils/DateUtils.js";
import { SubmissionFileApi } from "../../api/assignment/SubmissionFileApi.js";
import QuillEditor from "../common/QuillEditor.jsx";

const SubmissionList = () => {
  const { courseId, assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const handleRowClick = (submissionId) => {
    setExpandedId(expandedId === submissionId ? null : submissionId);
  };

  const handleFileDownload = async (submissionId, fileId, fileName) => {
    try {
      const downloadUrl = await SubmissionFileApi.getFileDownloadUrl(
          courseId,
          assignmentId,
          submissionId,
          fileId
      );

      // 다운로드 URL을 받아서 직접 다운로드 처리
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

  const fetchSubmissions = async () => {
    try {
      const response = await SubmissionApi.getAllSubmissions(courseId, assignmentId);
      setSubmissions(response);
      // 피드백 초기 상태 설정
      const initialFeedbacks = {};
      response.forEach(sub => {
        initialFeedbacks[sub.id] = sub.feedback || '';
      });
      setFeedbacks(initialFeedbacks);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeWithFeedback = async (submissionId, grade) => {
    try {
      await SubmissionApi.gradeSubmission(courseId, assignmentId, submissionId, {
        grade,
        feedback: feedbacks[submissionId]
      });
      fetchSubmissions(); // 목록 새로고침
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('채점 중 오류가 발생했습니다.');
    }
  };

  const handleFeedbackChange = (submissionId, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [submissionId]: value
    }));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [courseId, assignmentId]);

  if (loading) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );
  }

  return (
      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">제출된 과제 목록</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">학생</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">제출일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">피드백</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">채점</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">첨부파일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                    <React.Fragment key={submission.id}>
                      <tr className="hover:bg-gray-50">
                        {/* 첫 4개 칼럼은 클릭 가능하게 */}
                        <td
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => handleRowClick(submission.id)}
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {submission.student?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.student?.email}
                          </div>
                        </td>
                        <td
                            className="px-6 py-4 text-sm text-gray-500 cursor-pointer"
                            onClick={() => handleRowClick(submission.id)}
                        >
                          {formatDate(submission.createdAt)}
                        </td>
                        <td
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => handleRowClick(submission.id)}
                        >
            <span className={`px-2 py-1 text-xs font-medium rounded-full...`}>
              {submission.status}
            </span>
                        </td>
                        <td
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => handleRowClick(submission.id)}
                        >
            <textarea
                className="w-full px-3 py-2 text-sm border rounded-lg..."
                onClick={e => e.stopPropagation()}  // textarea는 클릭해도 행이 확장되지 않게
                value={feedbacks[submission.id]}
                onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
            />
                        </td>
                        {/* 채점 버튼 칼럼 - 클릭해도 행이 확장되지 않음 */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                                onClick={(e) => handleGradeWithFeedback(submission.id, 'PASS')}
                                className={`p-2 rounded-lg transition-colors flex items-center ${
                                    submission.grade === '통과'
                                        ? 'bg-green-100 text-green-600 font-medium'
                                        : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                }`}
                            >
                              <CheckCircle2 size={20} className={submission.grade === '통과' ? 'fill-green-100' : ''}/>
                              <span className="text-xs ml-1">통과</span>
                            </button>
                            <button
                                onClick={(e) => handleGradeWithFeedback(submission.id, 'NONE_PASS')}
                                className={`p-2 rounded-lg transition-colors flex items-center ${
                                    submission.grade === '미통과'
                                        ? 'bg-red-100 text-red-600 font-medium'
                                        : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                }`}
                            >
                              <XCircle size={20} className={submission.grade === '미통과' ? 'fill-red-100' : ''}/>
                              <span className="text-xs ml-1">미통과</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            {/* 파일 다운로드 버튼들도 클릭해도 행이 확장되지 않음 */}
                            {submission.files?.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => handleFileDownload(submission.id, file.id, file.originalFileName)}
                                    className="p-2 hover:bg-gray-100..."
                                >
                                  <Download size={18}/>
                                </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {expandedId === submission.id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="bg-white rounded-lg p-4">
                                  <h3 className="font-medium text-gray-900 mb-2">제출 내용</h3>
                                  <QuillEditor
                                      value={submission.description}
                                      readOnly={true}
                                  />
                                </div>

                                {submission.files?.length > 0 && (
                                    <div className="bg-white rounded-lg p-4">
                                      <h3 className="font-medium text-gray-900 mb-2">첨부 파일</h3>
                                      <div className="space-y-2">
                                        {submission.files.map((file) => (
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
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileDownload(submission.id, file.id, file.originalFileName);
                                                  }}
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
                            </td>
                          </tr>
                      )}
                    </React.Fragment>
                ))}
              </tbody>
            </table>

            {submissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  제출된 과제가 없습니다.
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default SubmissionList;
