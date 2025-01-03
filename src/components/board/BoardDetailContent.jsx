import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import CommentItem from '../../components/board/CommentItem.jsx';
import boardApiClient from '../../api/boardAxios';

const BoardDetailContent = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await boardApiClient.get(`/posts/${postId}`);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await boardApiClient.delete(`/posts/${postId}`);
      navigate('/board');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const { data } = await boardApiClient.post(`/posts/${postId}/like`, {
        userId: user.username
      });

      setPost(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          likes: data.likes
        },
        likedUsers: data.likedUsers
      }));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data: newComment } = await boardApiClient.post(`/posts/${postId}/comments`, {
        content: comment,
        author: {
          id: user.username,
          name: user.username
        }
      });

      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        metadata: {
          ...prev.metadata,
          commentsCount: (prev.metadata?.commentsCount || 0) + 1
        }
      }));
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      const { data: updatedComment } = await boardApiClient.put(
          `/posts/${postId}/comments/${commentId}`,
          content
      );

      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(c =>
            c.id === commentId ? updatedComment : c
        )
      }));
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await boardApiClient.delete(`/posts/${postId}/comments/${commentId}`);

      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
        metadata: {
          ...prev.metadata,
          commentsCount: prev.metadata.commentsCount - 1
        }
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );
  }

  if (!post) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">게시글을 찾을 수 없습니다.</div>
        </div>
    );
  }

  const isLiked = post.likedUsers?.includes(user?.username);
  const isAuthor = post.author?.id === user?.username;

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          {/* 헤더 */}
          <div className="mb-6 flex justify-between items-center">
            <button
                onClick={() => navigate('/board')}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2" size={20} />
              목록으로
            </button>
            {isAuthor && (
                <div className="space-x-2">
                  <button
                      onClick={() => navigate(`/board/write?edit=${postId}`)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    수정
                  </button>
                  <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
            )}
          </div>

          {/* 게시글 내용 */}
          <article>
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{post.author?.name}</span>
                  <span className="text-gray-500">
                  {new Date(post.metadata?.createdAt).toLocaleDateString()}
                </span>
                </div>
                <div className="flex items-center space-x-6">
                  <button
                      onClick={handleLike}
                      className="flex items-center space-x-1 group"
                  >
                    <Heart
                        size={20}
                        className={`${
                            isLiked
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 group-hover:text-red-500'
                        }`}
                    />
                    <span className={isLiked ? 'text-red-500' : 'text-gray-500'}>
                    {post.metadata?.likes || 0}
                  </span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Eye size={20} className="text-gray-400" />
                    <span className="text-gray-500">{post.metadata?.views || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={20} className="text-gray-400" />
                    <span className="text-gray-500">
                    {post.metadata?.commentsCount || 0}
                  </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags?.map((tag, index) => (
                  <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                #{tag}
              </span>
              ))}
            </div>
          </article>

          {/* 댓글 섹션 */}
          <section className="mt-12">
            <h2 className="text-lg font-bold mb-4">
              댓글 {post.metadata?.commentsCount || 0}
            </h2>

            {/* 댓글 작성 폼 */}
            {user && (
                <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-black"
                  rows="3"
                  placeholder="댓글을 작성해주세요"
              />
                  <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isSubmitting ? '작성 중...' : '댓글 작성'}
                    </button>
                  </div>
                </form>
            )}

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {post.comments?.map((comment) => (
                  <CommentItem
                      key={comment.id}
                      comment={comment}
                      onUpdate={handleCommentUpdate}
                      onDelete={handleCommentDelete}
                      currentUserId={user?.username}
                  />
              ))}
            </div>
          </section>
        </div>
      </main>
  );
};

export default BoardDetailContent;
