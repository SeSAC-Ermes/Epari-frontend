import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/default-avatar.png';

function PostCard({ post }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    const postId = post.id.split('#')[1];
    navigate(`/courses/write?edit=${postId}`);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/courses/${post.courseId}/board/posts/${post.id.split('#')[1]}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete post');

      // 부모 컴포넌트에서 목록을 새로고침하거나 해당 게시글을 제거
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setShowMenu(false);
  };

  // HTML에서 텍스트만 추출하는 함수
  const extractTextFromHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // 내용에서 첫 200자만 추출하고 HTML 태그 제거
  const createExcerpt = (content) => {
    const plainText = extractTextFromHtml(content);
    return plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
  };

  // PK에서 숫자만 추출 (POST#00001 -> 1)
  const postId = post.id.split('#')[1];

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl divide-y divide-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full" src={defaultAvatar} alt="" />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
            {showMenu && post.author.id === "user123" && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Link to={`/courses/${post.courseId}/board/${post.id}`}>
          <h2 className="mt-4 text-xl font-semibold hover:text-blue-600">{post.title}</h2>
        </Link>
        <p className="mt-2 text-gray-600">{createExcerpt(post.content)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags || []).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black bg-opacity-5 text-gray-900 hover:bg-opacity-10 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <i className="far fa-eye mr-1.5"></i>
            <span>{post.metadata?.views || 0} views</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <i className="far fa-heart mr-1.5"></i>
            <span>{post.metadata?.likes || 0} likes</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <i className="far fa-comment mr-1.5"></i>
            <span>{post.metadata?.commentsCount || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard; 