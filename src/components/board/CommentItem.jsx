import React, { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.jsx";
import defaultAvatar from '../../assets/default-avatar.jpg';
import { getCurrentUser } from '../../api/boardAxios';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      if (user) {
        const userInfo = await getCurrentUser();
        setCurrentUser(userInfo);
      }
    };
    loadUserInfo();
  }, [user]);

  const isAuthor = currentUser?.id === comment.author.id;

  const getProfileImageUrl = () => {
    if (comment.author?.loginType === 'google' && comment.author?.picture) {
      return comment.author.picture;
    }
    return defaultAvatar;
  };

  const getDisplayName = () => {
    const name = comment.author?.name || comment.author?.email?.split('@')[0] || 'Unknown User';
    // 로그인 타입에 따라 이름 옆에 작은 배지 표시 (선택사항)
    const badge = comment.author?.loginType === 'google' ? '(Google)' : '';
    return `${name} ${badge}`;
  };

  const handleSubmit = async () => {
    if (!editContent.trim()) return;

    try {
      await onUpdate(comment.id, { content: editContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  return (
      <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
        <img
            src={getProfileImageUrl()}
            alt={getDisplayName()}
            className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              {getDisplayName()}
            </h4>
            {comment.author?.loginType === 'google' && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Google
              </span>
            )}
            <div className="flex items-center space-x-2">
              <time className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
              {isAuthor && (
                  <div className="flex space-x-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                        onClick={() => onDelete(comment.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
              )}
            </div>
          </div>
          {isEditing ? (
              <div className="mt-2">
            <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black"
                rows="3"
            />
                <div className="mt-2 flex justify-end">
                  <button
                      onClick={handleSubmit}
                      className="px-3 py-1 bg-black text-white text-sm rounded-full hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </div>
          ) : (
              <p className="mt-1 text-sm text-gray-600">{comment.content}</p>
          )}
        </div>
      </div>
  );
}

export default CommentItem;
