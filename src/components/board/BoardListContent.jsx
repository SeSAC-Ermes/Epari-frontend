import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, MessageSquare, Plus, Search } from 'lucide-react';
import { formatDate } from '../../utils/DateUtils';
import { useAuth } from '../../auth/AuthContext';
import TagSearch from './TagSearch';
import TrendingPosts from './TrendingPosts';
import CategorySlider from "../../components/board/CategorySlider.jsx";

const BoardListContent = () => {
  const [allPosts, setAllPosts] = useState([]); // 전체 게시물 저장
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState(null);
  const { user } = useAuth();

  // 게시판 카테고리
  const categories = [
    { value: 'ALL', label: '전체' },
    { value: 'MY', label: 'My 게시글' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Security', label: 'Security' },
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Database', label: 'Database' },
    { value: 'Blockchain', label: 'Blockchain' }
  ];

  // 초기 게시물 로딩
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setAllPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // 클라이언트 사이드 필터링
  useEffect(() => {
    const filterPosts = () => {
      let result = [...allPosts];

      // 검색어 필터링
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(post =>
            post.title?.toLowerCase().includes(query) ||
            post.content?.toLowerCase().includes(query) ||
            post.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // 카테고리 필터링
      if (selectedCategory && selectedCategory !== 'ALL') {
        if (selectedCategory === 'MY') {
          result = result.filter(post => post.author?.id === user?.username);
        } else {
          result = result.filter(post => post.category === selectedCategory);
        }
      }

      // 태그 필터링
      if (selectedTag) {
        result = result.filter(post =>
            post.tags?.includes(selectedTag)
        );
      }

      setFilteredPosts(result);
    };

    filterPosts();
  }, [searchQuery, selectedCategory, selectedTag, allPosts, user?.username]);

  // 서버 동기화
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setAllPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 좋아요 기능
  const handleLikeClick = async (postId) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.username }),
      });

      if (!response.ok) throw new Error('Failed to update like');

      const { likes, likedUsers } = await response.json();

      // allPosts와 filteredPosts 모두 업데이트
      const updatePosts = (posts) =>
          posts.map(post =>
              post.id === postId
                  ? {
                    ...post,
                    metadata: {
                      ...post.metadata,
                      likes,
                    },
                    likedUsers
                  }
                  : post
          );

      setAllPosts(updatePosts(allPosts));
      setFilteredPosts(updatePosts(filteredPosts));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setSearchQuery(''); // 태그 선택 시 검색어 초기화
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // 검색어가 비어있을 때 바로 초기화
    if (!value.trim()) {
      const fetchInitialPosts = async () => {
        try {
          const response = await fetch('/api/posts');
          if (!response.ok) throw new Error('Failed to fetch posts');
          const data = await response.json();
          setAllPosts(data);
          setFilteredPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
      fetchInitialPosts();
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  return (
      <div className="flex gap-8">
        {/* 메인 컨텐츠 */}
        <main className="flex-1">
          <div className="bg-white rounded-lg p-6">
            {/* 카테고리 필터 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 mr-4">
                <CategorySlider
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* 글쓰기 버튼 */}
              <Link
                  to="/board/write"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <Plus size={20} />
                <span>글쓰기</span>
              </Link>
            </div>

            {/* 검색창 */}
            <div className="mb-6">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="검색어를 입력하세요..."
                    className="bg-transparent border-none outline-none ml-2 w-full"
                />
              </div>
            </div>

            {/* 선택된 태그 표시 */}
            {selectedTag && (
                <div className="mb-4 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">선택된 태그:</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                #{selectedTag}
                    <button
                        onClick={() => setSelectedTag(null)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                  ×
                </button>
              </span>
                </div>
            )}

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isLiked = post.likedUsers?.includes(user?.username);

                return (
                    <div
                        key={post.id}
                        className="bg-white p-6 rounded-lg border hover:border-black transition-colors duration-200"
                    >
                      <Link to={`/board/${post.id}`}>
                        <h2 className="text-xl font-medium mb-2 hover:text-blue-600">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.content?.replace(/<[^>]+>/g, '').slice(0, 200)}...
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.map((tag, index) => (
                              <button
                                  key={index}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleTagSelect(tag);
                                  }}
                                  className="px-2 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200"
                              >
                                #{tag}
                              </button>
                          ))}
                        </div>
                      </Link>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.author?.name}</span>
                          <span>{formatDate(post.metadata?.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleLikeClick(post.id);
                              }}
                              className="flex items-center space-x-1 group"
                          >
                            <Heart
                                size={18}
                                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}
                            />
                            <span className="group-hover:text-red-500">
                          {post.metadata?.likes || 0}
                        </span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <Eye size={18} className="text-gray-400" />
                            <span>{post.metadata?.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare size={18} className="text-gray-400" />
                            <span>{post.metadata?.commentsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* 사이드바 */}
        <aside className="w-80 space-y-6">
          {/* 태그 검색 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">인기 태그</h3>
            <TagSearch onTagSelect={handleTagSelect} />
          </div>

          {/* 인기 게시물 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">인기 게시물</h3>
            <TrendingPosts />
          </div>
        </aside>
      </div>
  );
};

export default BoardListContent;
