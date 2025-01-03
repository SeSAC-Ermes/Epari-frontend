import React, { useEffect, useState } from 'react';
import boardApiClient from '../../api/boardAxios';

function TagSearch({ onTagSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchPopularTags = async () => {
      try {
        const { data } = await boardApiClient.get('/tags/popular');
        if (!mounted) return;
        setPopularTags(data);
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      }
    };

    fetchPopularTags();
    return () => {
      mounted = false;
    };
  }, []);

  return (
      <div className="mb-6">
        <div className="mt-4 flex flex-wrap gap-2">
          {popularTags.map(tagItem => (
              <button
                  key={tagItem.tag}
                  onClick={() => onTagSelect(tagItem.tag)}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
              >
                #{tagItem.tag} ({tagItem.count})
              </button>
          ))}
        </div>
      </div>
  );
}

export default TagSearch;
