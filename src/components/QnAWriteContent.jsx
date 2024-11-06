import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QnAWriteContent = ({
                           onComplete = () => {
                           }, onTitleChange = () => {
  }, onContentChange = () => {
  }
                         }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태

  const handleButtonClick = () => {
    fileInputRef.current.click(); // 파일 입력 클릭
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 선택한 파일
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 파일을 읽어서 미리보기 설정
      };
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    } else {
      alert('이미지 파일만 업로드 가능합니다.'); // 이미지 파일 체크
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null); // 이미지 삭제
    fileInputRef.current.value = ''; // 파일 입력 초기화
  };

  return (
      <div className="p-6 max-w-5xl h-[800px] mx-auto overflow-auto">
        {/* Header */}
        <h1 className="text-xl font-bold mb-8">Q&A 작성 화면</h1>

        {/* Content */}
        <div className="space-y-6">
          {/* Top Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <span className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full">
              BACK-END
            </span>
              <input
                  type="text"
                  placeholder="AWS 인프라 구축 관련 질문"
                  className="w-[500px] px-4 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                  onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>
            <button
                onClick={() => navigate('/qnalist')}
                className="px-4 py-1 text-sm border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50"
            >
              작성 완료
            </button>
          </div>

          {/* Editor Section */}
          <div className="border rounded-lg max-h-[800px]">
            {/* Editor Toolbar */}
            <div className="flex justify-end p-2 border-b">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded" onClick={handleButtonClick}>
                  <svg
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <svg
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="relative p-6">
              {/* 이미지 미리보기 */}
              {imagePreview && (
                  <div className="relative mb-4">
                    <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className="max-w-full h-auto"
                    />
                    <button
                        onClick={handleImageRemove}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        style={{ marginTop: '-10px', marginRight: '-10px' }} // 이미지 위쪽에 X 버튼 위치 조정
                    >
                      &times; {/* x 표시 */}
                    </button>
                  </div>
              )}
              <textarea
                  className={`max-h-[800px] w-full resize-none focus:outline-none overflow-auto ${imagePreview ? 'min-h-[400px]' : 'min-h-[200px]'}`}
                  placeholder="내용을 입력해주세요"
                  onChange={(e) => onContentChange(e.target.value)}
                  style={{ paddingTop: imagePreview ? '150px' : '10px' }} // 이미지 높이에 따라 패딩 조정
              />
            </div>
          </div>
        </div>

        {/* 숨겨진 파일 입력 필드 */}
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
        />
      </div>
  );
};

export default QnAWriteContent;
