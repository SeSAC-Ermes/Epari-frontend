import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Download, FileText, Search, XCircle } from 'lucide-react';
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [combinedData, setCombinedData] = useState([]);

  const handleRowClick = (studentId) => {
    setExpandedId(expandedId === studentId ? null : studentId);
  };

  const handleFileDownload = async (submissionId, fileId, fileName) => {
    try {
      const downloadUrl = await SubmissionFileApi.getFileDownloadUrl(
          courseId,
          assignmentId,
          submissionId,
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

  const fetchAllData = async () => {
    try {
      const submissionsResponse = await SubmissionApi.getAllSubmissions(courseId, assignmentId);

      const actualSubmissions = submissionsResponse.filter(
          submission => submission.status !== '미제출'
      );
      setSubmissions(actualSubmissions);

      const allStudentsData = submissionsResponse.map(submission => ({
        id: submission.student?.id,
        name: submission.student?.name,
        email: submission.student?.email,
        submission: submission,
        status: submission.status,
        grade: submission.grade,
        files: submission.files || [],
        description: submission.description || '',
        createdAt: submission.createdAt,
        submissionId: submission.id
      }));

      const sortedData = allStudentsData.sort((a, b) =>
          a.name.localeCompare(b.name)
      );

      setCombinedData(sortedData);

      const initialFeedbacks = {};
      actualSubmissions.forEach(submission => {
        if (submission.id) {
          initialFeedbacks[submission.id] = submission.feedback || '';
        }
      });
      setFeedbacks(initialFeedbacks);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeWithFeedback = async (submissionId, grade) => {
    if (!submissionId) {
      alert('미제출된 과제는 채점할 수 없습니다.');
      return;
    }

    try {
      await SubmissionApi.gradeSubmission(courseId, assignmentId, submissionId, {
        grade,
        feedback: feedbacks[submissionId]
      });
      fetchAllData();
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('채점 중 오류가 발생했습니다.');
    }
  };

  const handleFeedbackChange = (submissionId, value) => {
    if (submissionId) {
      setFeedbacks(prev => ({
        ...prev,
        [submissionId]: value
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [courseId, assignmentId]);

  const filteredData = searchKeyword
      ? combinedData.filter(student =>
          student.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          student.email.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      : combinedData;

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"/>
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">과제 제출 현황</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400"/>
              </div>
              <input
                  type="text"
                  placeholder="학생 이름 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-500">전체 학생</h3>
              <p className="text-xl font-bold mt-1">{combinedData.length}명</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-500">과제 제출</h3>
              <p className="text-xl font-bold mt-1 text-green-600">
                {submissions.length}명
                <span className="text-sm text-gray-500 font-normal ml-2">
                ({Math.round((submissions.length / combinedData.length) * 100)}%)
              </span>
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-500">미제출</h3>
              <p className="text-xl font-bold mt-1 text-gray-600">
                {combinedData.length - submissions.length}명
                <span className="text-sm text-gray-500 font-normal ml-2">
                ({Math.round(((combinedData.length - submissions.length) / combinedData.length) * 100)}%)
              </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">학생</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제출일</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">피드백</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">채점</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">첨부파일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                    filteredData.map((student) => (
                        <React.Fragment key={student.id}>
                          <tr className={`hover:bg-gray-50 ${student.status === '미제출' ? 'bg-gray-50' : ''}`}>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => student.status !== '미제출' && handleRowClick(student.id)}
                            >
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {student.createdAt ? formatDate(student.createdAt) : '-'}
                            </td>
                            <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === '미제출'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-green-100 text-green-600'
                        }`}>
                          {student.status}
                        </span>
                            </td>
                            <td className="px-6 py-4">
                        <textarea
                            className={`w-full px-3 py-2 text-sm border rounded-lg ${
                                student.status === '미제출' ? 'bg-gray-50' : ''
                            }`}
                            value={student.submissionId ? (feedbacks[student.submissionId] || '') : ''}
                            onChange={(e) => handleFeedbackChange(student.submissionId, e.target.value)}
                            placeholder={student.status === '미제출' ? '미제출된 과제입니다' : '피드백을 입력하세요'}
                            disabled={student.status === '미제출'}
                        />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleGradeWithFeedback(student.submissionId, 'PASS')}
                                    disabled={student.status === '미제출'}
                                    className={`p-2 rounded-lg transition-colors flex items-center ${
                                        student.grade === '통과'
                                            ? 'bg-green-100 text-green-600 font-medium'
                                            : student.status === '미제출'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                    }`}
                                >
                                  <CheckCircle2 size={20} className={student.grade === '통과' ? 'fill-green-100' : ''}/>
                                  <span className="text-xs ml-1">통과</span>
                                </button>
                                <button
                                    onClick={() => handleGradeWithFeedback(student.submissionId, 'NONE_PASS')}
                                    disabled={student.status === '미제출'}
                                    className={`p-2 rounded-lg transition-colors flex items-center ${
                                        student.grade === '미통과'
                                            ? 'bg-red-100 text-red-600 font-medium'
                                            : student.status === '미제출'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                    }`}
                                >
                                  <XCircle size={20} className={student.grade === '미통과' ? 'fill-red-100' : ''}/>
                                  <span className="text-xs ml-1">미통과</span>
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                {student.files?.map((file) => (
                                    <button
                                        key={file.id}
                                        onClick={() => handleFileDownload(student.submissionId, file.id, file.originalFileName)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                      <Download size={18}/>
                                    </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                          {expandedId === student.id && student.status !== '미제출' && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                  <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4">
                                      <h3 className="font-medium text-gray-900 mb-2">제출 내용</h3>
                                      <QuillEditor
                                          value={student.description}
                                          readOnly={true}
                                      />
                                    </div>

                                    {student.files?.length > 0 && (
                                        <div className="bg-white rounded-lg p-4">
                                          <h3 className="font-medium text-gray-900 mb-2">첨부 파일</h3>
                                          <div className="space-y-2">
                                            {student.files.map((file) => (
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
                                                        handleFileDownload(student.submissionId, file.id, file.originalFileName);
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
                    ))
                ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        {searchKeyword ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
};

export default SubmissionList;
