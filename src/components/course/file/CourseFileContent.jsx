import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseFileAPI } from '../../../api/course/CourseFileApi.js';
import FileDownloadList from './FileDownloadList.jsx';
import ReactQuill from 'react-quill';
import FileUpload from "../../common/FileUpload.jsx";
import { quillFormats, quillModules } from '../../common/QuillConfig.js';
import 'react-quill/dist/quill.snow.css';

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

  // 수정 관련 상태
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
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
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Decoded token payload:', decodedPayload);

      const isInstructor = decodedPayload['cognito:groups']?.includes('INSTRUCTOR') || false;
      console.log('Is instructor:', isInstructor);
      return isInstructor;
    } catch (e) {
      console.error('Token parsing error:', e);
      return false;
    }
  };

  const handleUploadClick = () => {
    navigate(`/courses/${courseId}/files/create`);
  };

  const handleEditClick = (e, file) => {
    e.stopPropagation(); // 이벤트 전파 중단
    setExpandedId(file.id); // 항상 확장
    setEditingId(editingId === file.id ? null : file.id);
    if (editingId !== file.id) {
      setEditTitle(file.title);
      setEditContent(file.content);
      setExistingFiles(file.files || []);
      setNewFiles([]);
    }
  };

  const handleFilesChange = (files) => {
    setNewFiles(files);
  };

  const handleEditSubmit = async (e, fileId) => {
    e.preventDefault();
    setError(null);

    if (!editTitle.trim() || !editContent.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);

      if (newFiles.length > 0) {
        newFiles.forEach(file => {
          formData.append('files', file);
        });
      }

      await CourseFileAPI.updateCourseFile(courseId, fileId, formData);

      // 현재 편집 중인 파일의 데이터만 업데이트
      const updatedContent = await CourseFileAPI.getCourseFileDetail(courseId, fileId);

      // fileData 업데이트
      setFileData(prevData =>
          prevData.map(file =>
              file.id === fileId
                  ? updatedContent
                  : file
          )
      );

      // 수정 모드 종료
      setEditingId(null);

    } catch (err) {
      console.error('Error during update:', err);
      setError(err.message || '수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 핸들러 함수
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

  // 토글 버튼을 위한 새로운 핸들러 추가
  const handleToggleClick = (e, fileId) => {
    e.stopPropagation(); // 이벤트 전파 중단
    setExpandedId(expandedId === fileId ? null : fileId);
  };

// handleRemoveExistingFile 함수를 다시 원래대로 수정
  const handleRemoveExistingFile = async (fileId, contentId) => {
    try {
      await CourseFileAPI.deleteFile(courseId, contentId, fileId);

      // 현재 편집 중인 파일의 파일 목록만 업데이트
      const updatedContent = await CourseFileAPI.getCourseFileDetail(courseId, contentId);

      // 기존 파일 목록 업데이트
      setExistingFiles(updatedContent.files || []);

      // fileData 전체 목록도 업데이트 (수정 모드는 유지)
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">강의 자료 목록</h1>
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

          <div className="mb-6">
            <div className="flex justify-end">
              <input
                  type="text"
                  placeholder="강의 자료 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ width: '168px' }}
              />
            </div>
          </div>

          <div className="border rounded-lg mb-4">
            <div className="grid grid-cols-5 p-4 bg-gray-50 font-medium text-gray-600">
              <div className="text-center">작성일자</div>
              <div className="text-center">작성자</div>
              <div className="text-center">제목</div>
              <div className="text-center">첨부파일</div>
              <div className="text-center">관리</div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredData.map((file) => (
                <div key={file.id} className="border rounded-lg">
                  <div className="grid grid-cols-5 p-4 hover:bg-gray-50">
                    <div
                        className="col-span-4 grid grid-cols-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleClick(e, file.id);
                        }}
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
                      {/* 토글 버튼 */}
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
                  {expandedId === file.id && (
                      <div className="border-t bg-gray-50">
                        {editingId === file.id ? (
                            <div className="p-6">
                              <form onSubmit={(e) => handleEditSubmit(e, file.id)} className="space-y-8">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">제목</label>
                                  <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                      required
                                  />
                                </div>

                                <div className="space-y-2" style={{ marginBottom: '80px' }}> {/* 직접적인 마진 추가 */}
                                  <label className="block text-sm font-medium text-gray-700">내용</label>
                                  <div className="rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        value={editContent}
                                        onChange={setEditContent}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="h-[200px]"
                                    />
                                  </div>
                                </div>

                                {existingFiles.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="border rounded-lg p-4 space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                          기존 첨부파일
                                        </label>
                                        <FileDownloadList
                                            files={existingFiles}
                                            courseId={courseId}
                                            contentId={file.id}
                                            onDelete={(fileId) => handleRemoveExistingFile(fileId, file.id)}
                                            isEditMode={true}
                                        />
                                      </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    새 파일 첨부
                                  </label>
                                  <FileUpload onFilesChange={handleFilesChange}/>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                  <button
                                      type="button"
                                      onClick={() => setEditingId(null)}
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
                              </form>
                            </div>
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
                                        onDelete={(fileId) => handleRemoveExistingFile(fileId, file.id)}
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

          {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 강의 자료가 없습니다.
              </div>
          )}
        </div>
      </main>
  );
};

export default CourseFileContent;
