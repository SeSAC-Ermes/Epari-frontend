import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseFileAPI } from '../../../api/course/courseFileAPI.js';
import FileDownloadList from './FileDownloadList.jsx';
import CourseFileEditForm from './CourseFileEditForm.jsx';
import 'react-quill/dist/quill.snow.css';

const CourseFileOffsetContent = () => {
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const fetchCourseFiles = async () => {
    if (!courseId) {
      setError('강의 ID가 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      const response = await CourseFileAPI.getCourseFilesWithOffset(
          courseId,
          currentPage,
          pageSize,
          sortBy,
          sortDirection
      );

      setFileData(response.content);
      setTotalPages(response.totalPages);
      setError(null);
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

    checkInstructorStatus();
    fetchCourseFiles();
  }, [courseId, currentPage, pageSize, sortBy, sortDirection]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleToggleClick = (e, fileId) => {
    e.stopPropagation();
    setExpandedId(expandedId === fileId ? null : fileId);
  };

  const handleEditClick = (e, file) => {
    e.stopPropagation();
    setExpandedId(file.id);
    setEditingId(editingId === file.id ? null : file.id);
  };

  const handleDeleteContent = async (e, contentId) => {
    e.stopPropagation();

    if (!window.confirm('정말로 이 강의 자료를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await CourseFileAPI.deleteCourseFile(courseId, contentId);
      await fetchCourseFiles();
      if (editingId === contentId) setEditingId(null);
      if (expandedId === contentId) setExpandedId(null);
    } catch (error) {
      console.error('Error deleting course content:', error);
      alert('강의 자료 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditSubmit = async (fileId, formData) => {
    try {
      setIsSubmitting(true);
      await CourseFileAPI.updateCourseFile(courseId, fileId, formData);
      await fetchCourseFiles();
      setEditingId(null);
    } catch (err) {
      console.error('Error during update:', err);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && fileData.length === 0) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">강의 자료를 불러오는 중...</div>
        </div>
    );
  }

  if (error && fileData.length === 0) {
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
            <h1 className="text-2xl font-bold">학습 활동 (오프셋 기반)</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">정렬:</span>
                <button
                    onClick={() => handleSortChange('date')}
                    className={`px-3 py-1 text-sm rounded ${
                        sortBy === 'date' ? 'bg-green-500 text-white' : 'bg-gray-100'
                    }`}
                >
                  날짜순
                  {sortBy === 'date' && (
                      <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                  )}
                </button>
                <button
                    onClick={() => handleSortChange('title')}
                    className={`px-3 py-1 text-sm rounded ${
                        sortBy === 'title' ? 'bg-green-500 text-white' : 'bg-gray-100'
                    }`}
                >
                  제목순
                  {sortBy === 'title' && (
                      <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                  )}
                </button>
              </div>
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
            {fileData.map((file) => (
                <div key={file.id} className="border rounded-lg">
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
                                contentId={file.id}
                                initialTitle={file.title}
                                initialContent={file.content}
                                existingFiles={file.files || []}
                                onSubmit={(formData) => handleEditSubmit(file.id, formData)}
                                onCancel={() => setEditingId(null)}
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

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg ${
                    currentPage === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                // 현재 페이지 주변 5개의 페이지만 표시
                if (
                    index === 0 || // 첫 페이지
                    index === totalPages - 1 || // 마지막 페이지
                    (index >= currentPage - 2 && index <= currentPage + 2) // 현재 페이지 주변
                ) {
                  return (
                      <button
                          key={index}
                          onClick={() => handlePageChange(index)}
                          className={`w-8 h-8 rounded-lg ${
                              currentPage === index
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                      >
                        {index + 1}
                      </button>
                  );
                } else if (
                    index === currentPage - 3 ||
                    index === currentPage + 3
                ) {
                  // 생략 부호 표시
                  return <span key={index}>...</span>;
                }
                return null;
              })}
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-lg ${
                    currentPage === totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* 빈 상태 메시지 */}
          {fileData.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                등록된 강의 자료가 없습니다.
              </div>
          )}
        </div>

        {/* ScrollToTop 버튼 */}
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-[9999]"
            aria-label="페이지 최상단으로 이동"
        >
          <ArrowUp size={24}/>
        </button>
      </main>
  );
};

export default CourseFileOffsetContent;
