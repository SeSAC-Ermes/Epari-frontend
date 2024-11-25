import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NoticeApi } from '../../api/notice/NoticeApi';
import { Loader2, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoticeEditContent = () => {
  const { noticeId, courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    files: []
  });
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const notice = await NoticeApi.getNotice(noticeId);
        setFormData({
          title: notice.title,
          content: notice.content,
          files: notice.files || []
        });
        setExistingFiles(notice.files || []);
        setLoading(false);
      } catch (error) {
        console.error('Notice fetch failed:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        navigate(-1);
      }
    };

    fetchNotice();
  }, [noticeId, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);

      // 강의 공지사항인 경우 courseId와 type 추가
      if (courseId) {
        formDataToSend.append('courseId', courseId);
        formDataToSend.append('type', 'COURSE');
      } else {
        formDataToSend.append('type', 'GLOBAL');
      }

      // 기존 파일 ID들 추가
      existingFiles.forEach(file => {
        formDataToSend.append('existingFileIds', file.id);
      });

      // 새로운 파일들 추가
      newFiles.forEach(file => {
        formDataToSend.append('files', file);
      });

      // 전송되는 데이터 확인을 위한 로깅
      console.log("=== Sending FormData ===");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await NoticeApi.updateNotice(noticeId, formDataToSend);

      if (courseId) {
        navigate(`/courses/${courseId}/notices`);
      } else {
        navigate('/notices/global');
      }
    } catch (error) {
      console.error('Notice update failed:', error);
      if (error.response?.data?.message) {
        alert(`공지사항 수정 실패: ${error.response.data.message}`);
      } else {
        alert('공지사항 수정에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileAdd = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const removeExistingFile = (fileId) => {
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeNewFile = (fileName) => {
    setNewFiles(prev => prev.filter(file => file.name !== fileName));
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="제목을 입력하세요"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
          </div>

          <div className="mb-4">
            <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                className="h-64 mb-12"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">첨부파일</h3>
              <label
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 cursor-pointer">
                <Upload size={16}/>
                <span>파일 추가</span>
                <input
                    type="file"
                    multiple
                    onChange={handleFileAdd}
                    className="hidden"
                />
              </label>
            </div>

            <ul className="space-y-2">
              {existingFiles.map((file) => (
                  <li key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.originalFileName}</span>
                    <button
                        type="button"
                        onClick={() => removeExistingFile(file.id)}
                        className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16}/>
                    </button>
                  </li>
              ))}
              {newFiles.map((file) => (
                  <li key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                        type="button"
                        onClick={() => removeNewFile(file.name)}
                        className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16}/>
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              {submitting && <Loader2 size={16} className="animate-spin"/>}
              저장
            </button>
          </div>
        </form>
      </div>
  );
};

export default NoticeEditContent;
