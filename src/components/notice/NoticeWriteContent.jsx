import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { quillFormats, quillModules } from "../common/QuillConfig.js";
import { NoticeApi } from "../../api/notice/NoticeApi.js";
import FileUpload from "../common/FileUpload.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";

const NoticeWriteContent = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, userGroups } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 디버깅을 위한 사용자 정보 출력
    console.log("Auth User Info:", user);
    console.log("User Groups:", userGroups);
  }, [user, userGroups]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', description);
      formData.append('type', 'COURSE');
      formData.append('courseId', courseId);
      formData.append('instructorId', user.username);

      // 전송 전 데이터 확인
      console.log("=== Sending Data ===");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      if (files.length > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      await NoticeApi.createNotice(formData);
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate(`/courses/${courseId}/notices`);
    } catch (err) {
      console.error('Upload Error:', err);
      // 상세 에러 정보 출력
      if (err.response?.data?.errors) {
        const errorDetails = err.response.data.errors;
        console.error('Validation Errors Details:', JSON.stringify(errorDetails, null, 2));
        // 각 에러 메시지를 사용자에게 보여줌
        const errorMessage = errorDetails.map(error => error.defaultMessage || error.message).join('\n');
        setError(errorMessage || '입력값이 올바르지 않습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //
  //   try {
  //     setIsSubmitting(true);
  //
  //     // FormData 생성 전 값들 확인
  //     console.log("=== Values before FormData ===");
  //     const parsedCourseId = Number(courseId);
  //     const parsedInstructorId = Number(user.username);  // 또는 적절한 ID 필드
  //
  //     console.log({
  //       title,
  //       content: description,
  //       type: 'COURSE',
  //       courseId: parsedCourseId,
  //       instructorId: parsedInstructorId
  //     });
  //
  //     const formData = new FormData();
  //     formData.append('title', title);
  //     formData.append('content', description);
  //     formData.append('type', 'COURSE');
  //     formData.append('courseId', parsedCourseId);
  //     formData.append('instructorId', parsedInstructorId);
  //
  //     // FormData 내용 확인
  //     console.log("=== FormData Contents ===");
  //     for (let pair of formData.entries()) {
  //       console.log(`${pair[0]}: ${pair[1]} (type: ${typeof pair[1]})`);
  //     }
  //
  //     if (files.length > 0) {
  //       files.forEach(file => {
  //         formData.append('files', file);
  //       });
  //     }
  //
  //     const response = await NoticeApi.createNotice(formData);
  //     console.log("Success response:", response);
  //
  //     alert('공지사항이 성공적으로 등록되었습니다.');
  //     navigate(`/courses/${courseId}/notices`);
  //   } catch (err) {
  //     console.error('Upload Error:', err);
  //     if (err.response?.data?.errors) {
  //       console.error('Validation errors:', err.response.data.errors);
  //     }
  //     setError(err.response?.data?.message || '공지사항 등록 중 오류가 발생했습니다.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //
  //   if (!userGroups.includes('INSTRUCTOR')) {  // 'INSTRUCTOR'로 수정
  //     setError('강사 권한이 없습니다.');
  //     return;
  //   }
  //
  //   try {
  //     setIsSubmitting(true);
  //
  //     const formData = new FormData();
  //     formData.append('title', title);
  //     formData.append('content', description);  // description을 content로 사용
  //     formData.append('type', 'COURSE');
  //     formData.append('courseId', Number(courseId));
  //     formData.append('instructorId', user.username);
  //
  //     // FormData 내용 상세 확인
  //     console.log("=== FormData Contents ===");
  //     console.log("title:", title);
  //     console.log("content:", description);
  //     console.log("type:", 'COURSE');
  //     console.log("courseId:", Number(courseId));
  //     console.log("instructorId:", user.username);
  //     console.log("files:", files);
  //
  //     // 전체 FormData 확인
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0] + ': ' + pair[1]);
  //     }
  //
  //     if (files.length > 0) {
  //       files.forEach(file => {
  //         formData.append('files', file);
  //       });
  //     }
  //
  //     const response = await NoticeApi.createNotice(formData);
  //     console.log("Response:", response);  // 응답 확인
  //
  //     alert('공지사항이 성공적으로 등록되었습니다.');
  //     navigate(`/courses/${courseId}/notices`);
  //   } catch (err) {
  //     console.error('Upload Error:', err);
  //     // 에러 응답 데이터 상세 출력
  //     if (err.response) {
  //       console.error('Error response data:', err.response.data);
  //       console.error('Error response status:', err.response.status);
  //     }
  //     setError(err.response?.data?.message || '공지사항 등록 중 오류가 발생했습니다.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };





  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //
  //   console.log('groups: ', userGroups);
  //
  //   // 강사 그룹 체크
  //   if (!userGroups.includes('INSTRUCTOR')) {
  //     setError('강사 권한이 없습니다.');
  //     return;
  //   }
  //
  //   if (!courseId) {
  //     setError('강의 ID가 없습니다.');
  //     return;
  //   }
  //
  //   if (!title.trim() || !description.trim()) {
  //     setError('제목과 내용을 모두 입력해 주세요.');
  //     return;
  //   }
  //
  //   try {
  //     setIsSubmitting(true);
  //
  //     const formData = new FormData();
  //     formData.append('title', title);
  //     formData.append('content', description);
  //     formData.append('type', 'COURSE');
  //     formData.append('courseId', Number(courseId));
  //     formData.append('instructorId', user.username);  // Cognito의 username을 instructorId로 사용
  //     // 또는 user.userId를 사용: formData.append('instructorId', user.userId);
  //
  //     if (files.length > 0) {
  //       files.forEach(file => {
  //         formData.append('files', file);
  //       });
  //     }
  //
  //     // 전송되는 데이터 확인
  //     console.log("Submitting form data:");
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0] + ': ' + pair[1]);
  //     }
  //
  //     await NoticeApi.createNotice(formData);
  //     alert('공지사항이 성공적으로 등록되었습니다.');
  //     navigate(`/courses/${courseId}/notices`);
  //   } catch (err) {
  //     console.error('Upload Error:', err);
  //     setError(err.response?.data?.message || '공지사항 등록 중 오류가 발생했습니다.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
                      <X size={20}/>
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
