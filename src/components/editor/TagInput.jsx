import React, { useState } from 'react';

function TagInput({ tags, onTagsChange, onTagDelete }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue('');
    }
  };

  const handleDelete = (indexToDelete) => {
    e.preventDefault(); // 이벤트 전파 중단
    onTagDelete(indexToDelete);
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {tags.map((tag, index) => (
        <span key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
          {tag}
          <button
            onClick={(e) => handleDelete(index)}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="outline-none flex-1 min-w-[100px]"
        placeholder="태그를 입력하세요..."
      />
    </div>
  );
}

export default TagInput; 