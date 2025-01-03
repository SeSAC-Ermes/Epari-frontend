import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import boardApiClient from '../../api/boardAxios';

function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const { data } = await boardApiClient.get('/posts/trending');
        if (!mounted) return;

        // 데이터가 배열인지 확인하고 설정
        setTrendingPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (mounted) {
          console.error('Error fetching trending posts:', error);
          setError(error.message);
          setTrendingPosts([]); // 에러 시 빈 배열로 설정
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTrendingPosts();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
          ))}
        </div>
    );
  }

  if (error || !Array.isArray(trendingPosts) || trendingPosts.length === 0) {
    return (
        <div className="text-center text-gray-500 py-4">
          현재 표시할 게시글이 없습니다.
        </div>
    );
  }

  return (
      <div className="space-y-4">
        {trendingPosts.map((post, index) => (
            <Link
                key={post.id}
                to={`/board/${post.id}`}
                className="flex items-start space-x-3 group"
            >
          <span className="flex-shrink-0 text-custom font-medium">
            {String(index + 1).padStart(2, '0')}
          </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {post.views?.toLocaleString() || 0} views
                </p>
              </div>
            </Link>
        ))}
      </div>
  );
}

export default TrendingPosts;
