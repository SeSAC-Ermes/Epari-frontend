import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import { AssignmentHeader } from '../../components/assignment/AssignmentHeader';
import { AssignmentAPI } from '../../api/assignment/AssignmentApi';
import { formatDate } from "../../utils/DateUtils.js";
import FileUpload from '../../components/common/FileUpload';
import 'react-quill/dist/quill.snow.css';

const AssignmentDetailPage = () => {
  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const modules = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    }
  };

  const formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'bullet', 'align', 'link', 'image'];

  useEffect(() => {
    fetchAssignmentDetails();
  }, [courseId, assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setIsLoading(true);
      const data = await AssignmentAPI.getAssignmentById(courseId, assignmentId);
      setAssignment(data);
    } catch (err) {
      setError('과제 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!submissionContent.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await AssignmentAPI.submitAssignment(courseId, assignmentId, {
        content: submissionContent,
        files: files
      });
      alert('과제가 성공적으로 제출되었습니다.');
      navigate(`/courses/${courseId}/assignments`);
    } catch (err) {
      setError(err.response?.data?.message || '과제 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  if (isLoading) {
    return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
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
                        <h2 className="text-lg font-medium">과제 제출</h2>
                        <div className="border border-gray-300 rounded-lg" style={{ height: '400px' }}>
                          <ReactQuill
                              theme="snow"
                              value={submissionContent}
                              onChange={setSubmissionContent}
                              modules={modules}
                              formats={formats}
                              className="h-[350px]"
                              placeholder="과제 내용을 입력하세요"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
                        <FileUpload onFilesChange={handleFilesChange} />
                      </div>

                      <div className="flex justify-end pb-8">
                        <button
                            type="submit"
                            className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                          {isSubmitting ? '제출 중...' : '과제 제출하기'}
                        </button>
                      </div>
                    </div>
                  </form>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default AssignmentDetailPage;
