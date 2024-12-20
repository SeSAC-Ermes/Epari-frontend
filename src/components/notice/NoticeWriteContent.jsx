import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { quillFormats, quillModules } from "../common/QuillConfig.js";
import { NoticeApi } from "../../api/notice/NoticeApi.js";
import FileUpload from "../common/FileUpload.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import axios from 'axios';

const NoticeWriteContent = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, userGroups } = useAuth();
  const quillRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await NoticeApi.uploadImage(formData);

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection() || { index: editor.getLength() };
      editor.insertEmbed(range.index, 'image', response.fileUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 붙여넣기 이벤트 핸들러
  const handlePaste = async (e) => {
    const clipboard = e.clipboardData;
    const items = clipboard?.items;

    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') === 0) {
        e.preventDefault(); // 이미지인 경우만 기본 동작 방지
        const file = item.getAsFile();

        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 크기는 5MB를 초과할 수 없습니다.');
          return;
        }

        try {
          const formData = new FormData();
          formData.append('files', file);

          const response = await NoticeApi.uploadImage(formData);

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection() || { index: editor.getLength() };
          editor.insertEmbed(range.index, 'image', response.fileUrl);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    }
  };


  useEffect(() => {
    if (!courseId) {
      alert('강의 ID가 필요합니다.');
      navigate('/courses');
      return;
    }

    if (!user) {
      setError('사용자 인증이 필요합니다.');
      return;
    }

    // 강사 ID 조회
    const fetchInstructorId = async () => {
      try {
        const response = await axios.get(`/api/instructors/by-username/${user.username}`);
        setInstructorId(response.data);
        console.log('Fetched instructor ID:', response.data);
      } catch (error) {
        console.error('Failed to fetch instructor ID:', error);
        setError('강사 정보를 가져오는데 실패했습니다.');
      }
    };

    if (user.username) {
      fetchInstructorId();
    }
  }, [user, courseId, navigate]);

  // Quill 에디터 설정
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorContainer = editor.root;

      editorContainer.addEventListener('paste', handlePaste);

      editor.getModule('toolbar').addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];

          if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            alert('이미지 크기는 5MB를 초과할 수 없습니다.');
            return;
          }

          if (file) {
            await handleImageUpload(file);
          }
        };
      });

      return () => {
        editorContainer.removeEventListener('paste', handlePaste);
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!courseId) {
      setError('강의 ID가 없습니다.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const images = tempDiv.getElementsByTagName('img');
      for (let i = images.length - 1; i >= 0; i--) {
        const img = images[i];
        if (img.src.startsWith('data:image')) {
          img.parentNode.removeChild(img);
        }
      }

      const submitFormData = new FormData();
      submitFormData.append('title', title);
      submitFormData.append('content', tempDiv.innerHTML);
      submitFormData.append('type', 'COURSE');
      submitFormData.append('courseId', courseId);
      submitFormData.append('instructorId', '1');

      if (files.length > 0) {
        files.forEach(file => {
          submitFormData.append('files', file);
        });
      }

      console.log("=== FormData Contents ===");
      for (let pair of submitFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await NoticeApi.createNotice(submitFormData);
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate(`/courses/${courseId}/notices`);
    } catch (err) {
      console.error('Upload Error:', err);
      if (err.response) {
        console.error('Server Response:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers
        });
      }
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };


  return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">공지사항 작성</h1>

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
                  placeholder="제목을 입력하세요"
                  required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">내용</label>
              <div className="border border-gray-300 rounded-lg" style={{ height: '400px' }}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-[350px]"
                    placeholder="내용을 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
              <FileUpload onFilesChange={handleFilesChange} />
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
                {isSubmitting ? '등록 중...' : '등록하기'}
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
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">{title}</h3>
                    <div
                        className="text-gray-600"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
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
          )}
        </div>
      </div>
  );
};

export default NoticeWriteContent;
