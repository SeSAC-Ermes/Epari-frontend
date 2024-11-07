import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const QnADetailContent = () => {
  const { num } = useParams();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(), // 임시 ID
      content: comment,
      createdAt: new Date().toISOString(),
      author: {
        name: '사용자', // 실제 구현시 로그인한 사용자 정보를 사용
        avatar: '/api/placeholder/32/32'
      }
    };

    try {
      // await axios.post(`/api/posts/${num}/comments`, { content: comment });
      setComments(prevComments => [...prevComments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

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
                {post?.content}
              </div>
            </div>
          </div>
        </div>

        {/* Answer section */}
        <div className="bg-gray-100 rounded-lg p-6 relative mb-6">
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

        {/* Comments section */}
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                      src={comment.author.avatar}
                      alt={`${comment.author.name}'s avatar`}
                      className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="border-b border-gray-200 mb-4"></div>

        {/* Comment input section */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
          <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 작성해주세요"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
          />
          <button
              type="submit"
              className="p-2 bg-green-400 rounded-lg hover:bg-green-500 transition-colors"
          >
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
        </form>
      </div>
  );
};

export default QnADetailContent;
