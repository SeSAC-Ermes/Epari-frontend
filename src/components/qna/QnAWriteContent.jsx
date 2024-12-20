import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

/**
 * Q&A 작성 컴포넌트
 * @param {function} onTitleChange - 제목 변경 시 호출되는 콜백 함수
 * @param {function} onContentChange - 내용 변경 시 호출되는 콜백 함수
 */
const QnAWriteContent = ({
                           onTitleChange,
                           onContentChange
                         }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const imageFileInputRef = useRef();
  const attachmentFileInputRef = useRef();
  const [contentBlocks, setContentBlocks] = useState([{ type: 'text', content: '' }]);
  const [attachments, setAttachments] = useState([]);
  const [uploadedImageNames, setUploadedImageNames] = useState(new Set());

  // 카테고리 관련 상태
  const [category, setCategory] = useState('BACK-END');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 카테고리별 스타일 정의
  const categoryStyles = {
    'BACK-END': 'bg-green-100 text-green-600',
    'FRONT-END': 'bg-orange-100 text-orange-600',
    'DATABASE': 'bg-blue-100 text-blue-600',
    'INFRA': 'bg-purple-100 text-purple-600',
    'SECURITY': 'bg-red-100 text-red-600',
    'ETC': 'bg-gray-100 text-gray-600'
  };

  // User profile state
  const { isGoogleUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "",
    profileImage: null
  });

  const fetchUserInfo = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.payload;

      if (isGoogleUser) {
        setUserInfo({
          name: idToken.name || '',
          profileImage: idToken['custom:profile_image'] || null
        });
      } else {
        const currentUser = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();

        setUserInfo({
          name: userAttributes.name || currentUser.username,
          profileImage: userAttributes['custom:profile_image']
        });
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [isGoogleUser]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown]);

  const ProfileImage = ({ userInfo }) => {
    const [imageError, setImageError] = useState(false);

    if (!userInfo.profileImage || imageError) {
      return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <User className="w-8 h-8 text-gray-400"/>
          </div>
      );
    }

    return (
        <img
            src={userInfo.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
        />
    );
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const handleComplete = () => {
    navigate(`/courses/${courseId}/qna`);
  };

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

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
        if (!uploadedImageNames.has(file.name)) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setContentBlocks(prev => [...prev, {
              type: 'image',
              content: reader.result,
              id: Date.now() + Math.random(),
              name: file.name
            }, { type: 'text', content: '' }]);

            setUploadedImageNames(prev => new Set([...prev, file.name]));
          };
          reader.readAsDataURL(file);
        }
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
      const isExisting = attachments.some(att => att.name === file.name);

      if (!isExisting) {
        const newAttachment = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: formatFileSize(file.size)
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    });
    event.target.value = '';
  };

  const handleAttachmentRemove = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleImageRemove = (index) => {
    setContentBlocks(prev => {
      const newBlocks = [...prev];
      const removedBlock = newBlocks[index];
      if (removedBlock.type === 'image') {
        setUploadedImageNames(prev => {
          const newSet = new Set(prev);
          newSet.delete(removedBlock.name);
          return newSet;
        });
      }

      newBlocks.splice(index, 1);

      if (index < newBlocks.length && index > 0 &&
          newBlocks[index].type === 'text' && newBlocks[index - 1].type === 'text') {
        newBlocks[index - 1].content += newBlocks[index].content;
        newBlocks.splice(index, 1);
      }
      return newBlocks;
    });
  };

  const handleTextChange = (index, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].content = value;
    setContentBlocks(newBlocks);

    const fullContent = newBlocks
        .map(block => block.type === 'text' ? block.content : `[Image: ${block.name}]`)
        .join('\n');
    onContentChange(fullContent);
  };

  return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-2xl font-bold mb-8">Q&A 작성 화면</h1>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative category-dropdown">
                <span
                    onClick={handleCategoryClick}
                    className={`inline-flex px-3 py-1 text-sm rounded-full whitespace-nowrap cursor-pointer min-w-[120px] justify-center ${categoryStyles[category]}`}
                >
    {category}
  </span>

                {showCategoryDropdown && (
                    <div className="absolute mt-1 w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {Object.keys(categoryStyles).map((categoryName) => (
                          <div
                              key={categoryName}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleCategorySelect(categoryName)}
                          >
          <span
              className={`inline-flex px-2 py-1 text-sm rounded-full w-full justify-center ${categoryStyles[categoryName]}`}>
            {categoryName}
          </span>
                          </div>
                      ))}
                    </div>
                )}
              </div>

              <input
                  type="text"
                  placeholder="제목을 입력해주세요"
                  className="flex-1 min-w-0 px-4 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                  onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>
            <button
                onClick={handleComplete}
                className="px-6 py-2 text-sm border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 whitespace-nowrap"
            >
              작성 완료
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg min-h-[calc(100vh-16rem)] bg-white overflow-hidden">
            <div className="flex justify-between items-center p-2 border-b bg-white">
              <div className="relative w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-gray-50">
                <ProfileImage userInfo={userInfo}/>
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
              {attachments.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {attachments.map((file) => (
                        <div key={file.id} className="relative border border-gray-200 rounded-lg p-2">
                          <span>[첨부파일: {file.name} ({file.size})]</span>
                          <button
                              onClick={() => handleAttachmentRemove(file.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                              style={{
                                lineHeight: '0',
                                fontSize: '20px',
                                paddingBottom: '1px'
                              }}
                          >
                            ×
                          </button>
                        </div>
                    ))}
                  </div>
              )}

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
                                overflow: 'hidden'
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
                                  lineHeight: '0',
                                  fontSize: '20px',
                                  paddingBottom: '1px'
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
      </div>
  );
};

QnAWriteContent.propTypes = {
  onTitleChange: PropTypes.func,
  onContentChange: PropTypes.func
};

QnAWriteContent.defaultProps = {
  onTitleChange: () => {
  },
  onContentChange: () => {
  }
};

export default QnAWriteContent;
