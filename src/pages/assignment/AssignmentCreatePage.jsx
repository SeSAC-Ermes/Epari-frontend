import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import QuillEditor from '../../components/common/QuillEditor';
import FileUpload from "../../components/common/FileUpload.jsx";
import { AssignmentAPI } from "../../api/assignment/AssignmentApi.js";
import TopBar from "../../components/layout/TopBar.jsx";
import courseAPI from "../../api/course/courseAPI.js";
import { withPageAuth } from "../../auth/WithAuth.jsx";

/**
 * 과제 출제하는 페이지입니다.
 */

const AssignmentCreatePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // 과제 컨테이너
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [instructorId, setInstructorId] = useState(null);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const courseResponse = await courseAPI.getCourseDetail(courseId);  // getCourseDetail 사용
        if (courseResponse.instructor) {
          setInstructorId(courseResponse.instructor.id);
        } else {
          setError('강의 담당 강사 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching lecture:', err);
        setError('강의 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchCourseInfo();
  }, [courseId]);

  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const today = formatDateForInput(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!instructorId) {
      setError('강의 담당 강사 정보가 필요합니다.');
      return;
    }

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      setError('모든 필드를 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      await AssignmentAPI.createAssignment(courseId, {
        title,
        description,
        dueDate,
        files
      }, instructorId);

      alert('과제가 성공적으로 생성되었습니다.');
      navigate(`/courses/${courseId}/assignments`);
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err.response?.data?.message || '과제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar/>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">과제 생성하기</h1>

              {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">제목</label>
                  <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="과제 제목을 입력하세요"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">설명</label>
                  <div className="rounded-lg">
                    <QuillEditor
                        value={description}
                        onChange={setDescription}
                        readOnly={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">제출 기한</label>
                  <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={today}  // 최소 날짜를 오늘로 설정
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                  />
                  {dueDate && dueDate < today && (
                      <p className="text-red-500 text-sm mt-1">
                        마감일은 현재 날짜보다 이후여야 합니다.
                      </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
                  <FileUpload onFilesChange={handleFilesChange}/>
                </div>

                <div className="flex gap-4 justify-end pb-8">
                  <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                  >
                    미리보기
                  </button>
                  <button
                      type="submit"
                      className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? '제출 중...' : '과제 제출하기'}
                  </button>
                </div>
              </form>

              {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">미리보기</h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={20}/>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">{title}</h3>
                        <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                        <div className="text-sm text-gray-500">
                          <p>제출 기한: {dueDate}</p>
                          {files.length > 0 && (
                              <div className="mt-2">
                                <p>첨부 파일:</p>
                                <ul className="list-disc list-inside">
                                  {files.map(file => (
                                      <li key={file.name}>{file.name}</li>
                                  ))}
                                </ul>
                              </div>
                          )}
                        </div>
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

export default withPageAuth(AssignmentCreatePage, 'ASSIGNMENT_CREATION');
