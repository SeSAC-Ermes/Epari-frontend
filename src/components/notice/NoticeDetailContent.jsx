import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoticeApi } from '../../api/notice/NoticeApi';
import { Download, FileText, PenSquare, Trash2 } from 'lucide-react';
import { RoleBasedComponent } from "../../auth/RoleBasedComponent.jsx";

const NoticeDetailContent = () => {
  const { noticeId, courseId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isImageFile = useCallback((fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  }, []);

  const fetchNotice = useCallback(async () => {
    if (!noticeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await NoticeApi.getNotice(noticeId);
      setNotice(response);
    } catch (err) {
      console.error('공지사항 조회 실패:', err);
      setError(err.message || '공지사항을 불러오는데 실패했습니다.');
      setNotice(null);
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleDelete = async () => {
    try {
      await NoticeApi.deleteNotice(noticeId);
      if (courseId) {
        navigate(`/courses/${courseId}/notices`);
      } else {
        navigate('/notices/global');
      }
    } catch (err) {
      console.error('공지사항 삭제 실패:', err);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    if (courseId) {
      navigate(`/courses/${courseId}/notices/${noticeId}/edit`);
    } else {
      navigate(`/notices/${noticeId}/edit`);
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`/api/notices/${noticeId}/files/${fileId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('파일 다운로드 실패');
      }

      const contentType = response.headers.get('content-type');
      const blob = await response.blob();

      if (contentType && contentType.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(blob);
        window.open(imageUrl);
        return;
      }

      const url = window.URL.createObjectURL(
          new Blob([blob], { type: contentType || 'application/octet-stream' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
    );
  }

  if (!notice) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">공지사항을 찾을 수 없습니다.</div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>

            <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-4">
              <div className="flex space-x-4">
                <span>작성자: {notice.instructorName}</span>
                <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
              <span>조회수: {notice.viewCount}</span>
            </div>

            <div className="mt-6 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: notice.content }}/>
            </div>

            {notice.files?.some(file => isImageFile(file.originalFileName)) && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {notice.files
                      .filter(file => isImageFile(file.originalFileName))
                      .map(file => (
                          <div key={file.id} className="relative aspect-video">
                            <img
                                src={`/api/notices/${noticeId}/files/${file.id}/download`}
                                alt={file.originalFileName}
                                className="rounded-lg object-contain w-full h-full"
                                onError={(e) => {
                                  console.error('Image loading error:', e);
                                  e.target.style.display = 'none';
                                }}
                            />
                          </div>
                      ))}
                </div>
            )}

            {notice.files?.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">첨부파일</h3>
                  <ul className="space-y-2">
                    {notice.files.map((file) => (
                        <li
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <FileText size={20} className="text-gray-400"/>
                            <span className="text-sm">
                        {file.originalFileName}
                              {file.fileSize && (
                                  <span className="text-gray-500 ml-2">
                            ({Math.round(file.fileSize / 1024)} KB)
                          </span>
                              )}
                      </span>
                          </div>
                          <button
                              onClick={() => handleFileDownload(file.id, file.originalFileName)}
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-50"
                          >
                            <Download size={16}/>
                            <span>다운로드</span>
                          </button>
                        </li>
                    ))}
                  </ul>
                </div>
            )}
          </div>
        </div>

        <RoleBasedComponent requiredRoles={['INSTRUCTOR']}>
          <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              <PenSquare size={18}/>
              <span>수정</span>
            </button>
            <button
                onClick={() => {
                  if (window.confirm('이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    handleDelete();
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={18}/>
              <span>삭제</span>
            </button>
          </div>
        </RoleBasedComponent>
      </div>
  );
};

export default NoticeDetailContent;
