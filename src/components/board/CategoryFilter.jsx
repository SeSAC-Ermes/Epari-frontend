import { useNavigate } from 'react-router-dom';

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const navigate = useNavigate();

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

  const handleCategoryChange = (category) => {
    onCategoryChange(category);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex space-x-4">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedCategory === category.value
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-black'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate('/courses/write')}
        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
      >
        + New Post
      </button>
    </div>
  );
}

export default CategoryFilter;
