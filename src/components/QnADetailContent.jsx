// QnADetailContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const QnADetailContent = () => {
  const { num } = useParams(); // URL에서 num 파라미터 추출
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    // 여기서 실제 데이터를 가져오는 API 호출을 구현하세요
    const fetchPost = async () => {
      try {
        // const response = await axios.get(`/api/posts/${num}`);
        // setPost(response.data);
        // setIsAuthor(response.data.authorId === currentUserId);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [num]);

  return (
      <div className="p-6 bg-white">
        {/* Header section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full">
            BACK-END
          </span>
            <span className="text-gray-800">AWS 인프라 구축 관련 질문</span>
          </div>
          <button className="px-4 py-1 text-sm bg-purple-100 text-purple-600 rounded-full">
            답변 완료
          </button>
        </div>

        {/* Question content section */}
        <div className="mb-6">
          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img
                    src="/api/placeholder/40/40"
                    alt="User avatar"
                    className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-h-[200px]">
                {/* 질문 내용은 여기에 표시됩니다 */}
                {post?.content}
              </div>
            </div>
          </div>
        </div>

        {/* Answer section - 회색 배경으로 변경 */}
        <div className="bg-gray-100 rounded-lg p-6 relative">
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                  src="/api/placeholder/40/40"
                  alt="Mentor avatar"
                  className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="pr-16">
            {isAuthor ? (
                <textarea
                    className="w-full min-h-[100px] p-4 border rounded-lg resize-none"
                    placeholder="답글을 작성해주세요"
                />
            ) : (
                <div className="w-full min-h-[100px] p-4 bg-gray-100 rounded-lg">
                  {post?.answer}
                </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-purple-400">댓글을 작성해주세요</span>
          <button className="p-2 bg-green-400 rounded-lg">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
  );
};


export default QnADetailContent;
