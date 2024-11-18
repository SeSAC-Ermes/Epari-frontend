import React, { useEffect, useState } from 'react';
import { ArrowUp, ChevronDown, ChevronUp, FileText, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseFileAPI } from '../../../api/course/CourseFileAPI.js';
import FileDownloadList from './FileDownloadList.jsx';
import ReactQuill from 'react-quill';
import FileUpload from "../../common/FileUpload.jsx";
import { quillFormats, quillModules } from '../../common/QuillConfig.js';
import 'react-quill/dist/quill.snow.css';

/**
 *  학습 활동 페이지 내용
 */

const CourseFileEditForm = ({
                              courseId,
                              file,
                              onSubmit,
                              onCancel,
                              onRemoveFile,
                              isSubmitting
                            }) => {
  const [title, setTitle] = useState(file.title);
  const [content, setContent] = useState(file.content);
  const [newFiles, setNewFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    onSubmit(formData);
  };

  return (
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700">제목</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>
            <div className="flex items-center gap-2 mt-7">
              <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
              >
                취소
              </button>
              <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
              >
                {isSubmitting ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </div>

          <div className="space-y-2" style={{ marginBottom: '80px' }}>
            <label className="block text-sm font-medium text-gray-700">내용</label>
            <div className="rounded-lg">
              <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-[200px]"
              />
            </div>
          </div>

          {file.files?.length > 0 && (
              <div className="space-y-2">
                <div className="border rounded-lg p-4 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    기존 첨부파일
                  </label>
                  <FileDownloadList
                      files={file.files}
                      courseId={courseId}
                      contentId={file.id}
                      onDelete={onRemoveFile}
                      isEditMode={true}
                  />
                </div>
              </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              새 파일 첨부
            </label>
            <FileUpload onFilesChange={files => setNewFiles(files)}/>
          </div>
        </form>
      </div>
  );
};

// 메인 컴포넌트
const CourseFileContent = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseFiles = async () => {
    if (!courseId) {
      setError('강의 ID가 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      const response = await CourseFileAPI.getCourseFiles(courseId);
      setFileData(response);
    } catch (err) {
      console.error('Error fetching course files:', err);
      setError('강의 자료를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkInstructorStatus = () => {
      const instructorStatus = getIsInstructorFromToken();
      setIsInstructor(instructorStatus);
    };

    fetchCourseFiles();
    checkInstructorStatus();
  }, [courseId]);

  const getIsInstructorFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload['cognito:groups']?.includes('INSTRUCTOR') || false;
    } catch (e) {
      console.error('Token parsing error:', e);
      return false;
    }
  };

  const handleUploadClick = () => {
    navigate(`/courses/${courseId}/files/create`);
  };

  const handleEditClick = (e, file) => {
    e.stopPropagation();
    setExpandedId(file.id);
    setEditingId(editingId === file.id ? null : file.id);
  };

  const handleEditSubmit = async (fileId, formData) => {
    try {
      setIsSubmitting(true);
      await CourseFileAPI.updateCourseFile(courseId, fileId, formData);
      const updatedContent = await CourseFileAPI.getCourseFileDetail(courseId, fileId);

      setFileData(prevData =>
          prevData.map(file =>
              file.id === fileId ? updatedContent : file
          )
      );
      setEditingId(null);
    } catch (err) {
      console.error('Error during update:', err);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (e, contentId) => {
    e.stopPropagation();

    if (!window.confirm('정말로 이 강의 자료를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await CourseFileAPI.deleteCourseFile(courseId, contentId);
      setFileData(prevData => prevData.filter(file => file.id !== contentId));
      if (editingId === contentId) setEditingId(null);
      if (expandedId === contentId) setExpandedId(null);
    } catch (error) {
      console.error('Error deleting course content:', error);
      alert('강의 자료 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleClick = (e, fileId) => {
    e.stopPropagation();
    setExpandedId(expandedId === fileId ? null : fileId);
  };

  const handleRemoveExistingFile = async (fileId, contentId) => {
    try {
      await CourseFileAPI.deleteFile(courseId, contentId, fileId);
      const updatedContent = await CourseFileAPI.getCourseFileDetail(courseId, contentId);

      setFileData(prevData =>
          prevData.map(file =>
              file.id === contentId
                  ? { ...file, files: updatedContent.files }
                  : file
          )
      );
    } catch (error) {
      console.error('Error removing file:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredData = fileData.filter(file =>
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">강의 자료를 불러오는 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* 헤더 영역 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">학습 활동</h1>
            <div className="flex items-center gap-4">
              <input
                  type="text"
                  placeholder="강의 자료 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ width: '168px' }}
              />
              {isInstructor && (
                  <button
                      onClick={handleUploadClick}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FileText size={20}/>
                    강의 자료 업로드
                  </button>
              )}
            </div>
          </div>
          {/* 테이블 헤더 */}
          <div className="border rounded-lg mb-4">
            <div className="grid grid-cols-5 p-4 bg-gray-50 font-medium text-gray-600">
              <div className="text-center">작성일자</div>
              <div className="text-center">작성자</div>
              <div className="text-center">제목</div>
              <div className="text-center">첨부파일</div>
              <div className="text-center">관리</div>
            </div>
          </div>

          {/* 파일 목록 */}
          <div className="space-y-4">
            {filteredData.map((file) => (
                <div key={file.id} className="border rounded-lg">
                  {/* 파일 항목 헤더 */}
                  <div className="grid grid-cols-5 p-4 hover:bg-gray-50">
                    <div
                        className="col-span-4 grid grid-cols-4 cursor-pointer"
                        onClick={(e) => handleToggleClick(e, file.id)}
                    >
                      <div className="text-center">{file.date}</div>
                      <div className="text-center">{file.instructor?.name || '정보 없음'}</div>
                      <div className="text-center text-blue-500">{file.title}</div>
                      <div className="text-center">
                        {file.files?.length > 0 && `${file.files.length}개의 첨부파일`}
                      </div>
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                      {isInstructor && (
                          <>
                            <button
                                onClick={(e) => handleEditClick(e, file)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Pencil size={16} className="text-gray-600"/>
                            </button>
                            <button
                                onClick={(e) => handleDeleteContent(e, file.id)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Trash2 size={16} className="text-red-500"/>
                            </button>
                          </>
                      )}
                      <button
                          onClick={(e) => handleToggleClick(e, file.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {expandedId === file.id ? (
                            <ChevronUp className="inline-block" size={20}/>
                        ) : (
                            <ChevronDown className="inline-block" size={20}/>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 확장된 내용 */}
                  {expandedId === file.id && (
                      <div className="border-t bg-gray-50">
                        {editingId === file.id ? (
                            <CourseFileEditForm
                                courseId={courseId}
                                file={file}
                                onSubmit={(formData) => handleEditSubmit(file.id, formData)}
                                onCancel={() => setEditingId(null)}
                                onRemoveFile={(fileId) => handleRemoveExistingFile(fileId, file.id)}
                                isSubmitting={isSubmitting}
                            />
                        ) : (
                            <div className="p-6">
                              <div
                                  className="prose max-w-none mb-4"
                                  dangerouslySetInnerHTML={{ __html: file.content }}
                              />
                              {file.files && file.files.length > 0 && (
                                  <div className="mt-4 pt-4 border-t">
                                    <h3 className="font-medium mb-2">첨부파일</h3>
                                    <FileDownloadList
                                        files={file.files}
                                        courseId={courseId}
                                        contentId={file.id}
                                    />
                                  </div>
                              )}
                            </div>
                        )}
                      </div>
                  )}
                </div>
            ))}
          </div>

          {/* 빈 상태 메시지 */}
          {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 강의 자료가 없습니다.
              </div>
          )}
        </div>

        {/* ScrollToTop 버튼 추가 */}
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-[9999]"
            aria-label="페이지 최상단으로 이동"
        >
          <ArrowUp size={24} />
        </button>

      </main>
  );
};

export default CourseFileContent;
