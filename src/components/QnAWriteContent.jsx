import React, { useRef, useState, useEffect } from 'react';  // useEffect 추가
import { User } from 'lucide-react';

const QnAWriteContent = ({
                           onComplete = () => {},
                           onTitleChange = () => {},
                           onContentChange = () => {},
                           onNavigate = () => {}
                         }) => {
  const imageFileInputRef = useRef();
  const attachmentFileInputRef = useRef();
  const [contentBlocks, setContentBlocks] = useState([{ type: 'text', content: '' }]);
  const [profileImage, setProfileImage] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState(new Set());

  // textarea 높이 자동 조절 함수
  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // contentBlocks가 변경될 때마다 모든 textarea 높이 자동 조절
  useEffect(() => {
    document.querySelectorAll('textarea').forEach(textarea => {
      adjustTextareaHeight(textarea);
    });
  }, [contentBlocks]);

  const handleImageButtonClick = () => {
    imageFileInputRef.current.click();
  };

  const handleAttachmentButtonClick = () => {
    attachmentFileInputRef.current.click();
  };

  const handleImageFileChange = (event) => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setContentBlocks(prev => [...prev, {
            type: 'image',
            content: reader.result,
            id: Date.now() + Math.random(),
            name: file.name
          }, { type: 'text', content: '' }]);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAttachmentFileChange = (event) => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      if (!attachedFiles.has(file.name)) {
        setAttachedFiles(prev => new Set([...prev, file.name]));

        const fileInfo = `[첨부파일: ${file.name} (${formatFileSize(file.size)})]`;

        setContentBlocks(prev => {
          const newBlocks = [...prev];
          const lastTextBlockIndex = prev.findLastIndex(block => block.type === 'text');

          if (lastTextBlockIndex !== -1) {
            if (!newBlocks[lastTextBlockIndex].content.includes(fileInfo)) {
              const currentContent = newBlocks[lastTextBlockIndex].content;
              const separator = currentContent && !currentContent.endsWith('\n') ? '\n' : '';
              newBlocks[lastTextBlockIndex].content += separator + fileInfo;
            }
          } else {
            newBlocks.push({ type: 'text', content: fileInfo });
          }

          return newBlocks;
        });
      }
    });
    event.target.value = '';
  };

  const handleTextChange = (index, value) => {
    const newBlocks = [...contentBlocks];
    const oldContent = newBlocks[index].content;
    newBlocks[index].content = value;
    setContentBlocks(newBlocks);

    const oldFiles = [...attachedFiles].filter(fileName =>
        oldContent.includes(`[첨부파일: ${fileName}`) && !value.includes(`[첨부파일: ${fileName}`));

    if (oldFiles.length > 0) {
      setAttachedFiles(prev => {
        const newSet = new Set(prev);
        oldFiles.forEach(fileName => newSet.delete(fileName));
        return newSet;
      });
    }

    const fullContent = newBlocks
        .map(block => block.type === 'text' ? block.content : `[Image: ${block.name}]`)
        .join('\n');
    onContentChange(fullContent);
  };

  const handleImageRemove = (index) => {
    setContentBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 1);

      if (index < newBlocks.length && index > 0 &&
          newBlocks[index].type === 'text' && newBlocks[index - 1].type === 'text') {
        newBlocks[index - 1].content += newBlocks[index].content;
        newBlocks.splice(index, 1);
      }
      return newBlocks;
    });
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-2xl font-bold mb-8">Q&A 작성 화면</h1>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            <span className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full whitespace-nowrap">
              BACK-END
            </span>
              <input
                  type="text"
                  placeholder="AWS 인프라 구축 관련 질문"
                  className="flex-1 min-w-0 px-4 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                  onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>
            <button
                onClick={() => onNavigate('/qnalist')}
                className="px-6 py-2 text-sm border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 whitespace-nowrap"
            >
              작성 완료
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg min-h-[calc(100vh-16rem)] bg-white overflow-hidden">
            <div className="flex justify-between items-center p-2 border-b bg-white">
              <div
                  className="relative w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => document.getElementById('profile-image-input').click()}>
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="w-8 h-8 text-gray-400"/>
                    </div>
                )}
              </div>
              <div className="flex space-x-1">
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                    onClick={handleImageButtonClick}
                    title="이미지 첨부"
                >
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
                        d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12a2 2 0 100-4 2 2 0 000 4z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 14l-4-4L6 18"
                    />
                  </svg>
                </button>

                <button
                    className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                    onClick={handleAttachmentButtonClick}
                    title="파일 첨부"
                >
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

            <div className="p-6 bg-white">
              <div className="space-y-4">
                {contentBlocks.map((block, index) => (
                    <div key={block.type === 'image' ? block.id : index} className="w-full">
                      {block.type === 'text' ? (
                          <textarea
                              className="w-full min-h-[100px] resize-none focus:outline-none bg-white"
                              placeholder={index === 0 ? "내용을 입력해주세요" : ""}
                              value={block.content}
                              onChange={(e) => {
                                adjustTextareaHeight(e.target);
                                handleTextChange(index, e.target.value);
                              }}
                              style={{
                                overflow: 'hidden'  // 스크롤바 제거
                              }}
                          />
                      ) : (
                          <div className="relative inline-block w-full border border-gray-200 rounded-lg p-2">
                            <img
                                src={block.content}
                                alt={block.name}
                                className="max-w-full w-auto max-h-[300px] mx-auto rounded-lg"
                            />
                            <button
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                style={{
                                  lineHeight: '0',  // 텍스트의 라인 높이를 0으로 설정
                                  fontSize: '20px', // x 크기 조정
                                  paddingBottom: '1px' // 미세 조정을 위한 패딩
                                }}
                            >
                              ×
                            </button>
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <input
            type="file"
            accept="image/*"
            multiple
            ref={imageFileInputRef}
            className="hidden"
            onChange={handleImageFileChange}
        />
        <input
            type="file"
            multiple
            ref={attachmentFileInputRef}
            className="hidden"
            onChange={handleAttachmentFileChange}
        />
        <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profile-image-input"
            onChange={handleProfileImageChange}
        />
      </div>
  );
};

export default QnAWriteContent;
