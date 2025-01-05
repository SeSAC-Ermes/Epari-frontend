import React, { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.jsx";
import { getCurrentUser } from '../../api/boardAxios';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [currentUser, setCurrentUser] = useState(null);

  // 기본 프로필 이미지 (연한 회색 배경의 사용자 아이콘)
  const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM4IiByPSIxNiIgZmlsbD0iI0E0QTdBRiIvPgogIDxwYXRoIGQ9Ik0yMiw4NiBjMC0xNSwxMi0yOCwyOC0yOGgyIGMxNSwwLDI4LDEzLDI4LDI4IiBmaWxsPSIjQTRBN0FGIi8+Cjwvc3ZnPg==";

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
    if (comment.author.id.startsWith('kakao_') || comment.author.id.startsWith('google_')) {
      return comment.author.picture || defaultProfileImage;
    }
    return defaultProfileImage;
  };

  const getDisplayName = () => {
    if (comment.author.name) {
      return comment.author.name;
    }
    if (comment.author.id.startsWith('google_')) {
      return currentUser?.name || comment.author.id;
    }
    return comment.author.id;
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
            <h4 className="text-sm font-medium text-gray-900">{getDisplayName()}</h4>
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
