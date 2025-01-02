import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = ({ categories, selectedCategory, onCategoryChange }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
      <div className="relative flex items-center w-full">
        {/* Left scroll button */}
        <button
            onClick={handlePrev}
            className={`absolute left-0 z-10 p-2 bg-white shadow-md rounded-full transition-opacity duration-200 ${
                currentPage === 0 ? 'opacity-0 cursor-default' : 'hover:bg-gray-50'
            }`}
            disabled={currentPage === 0}
            aria-label="Previous categories"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Categories container */}
        <div className="flex-1 mx-10">
          <div className="flex justify-center space-x-4 px-2">
            {visibleCategories.map(category => (
                <button
                    key={category.value}
                    onClick={() => onCategoryChange(category.value)}
                    className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.value
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-black'
                    }`}
                >
                  {category.label}
                </button>
            ))}
          </div>
        </div>

        {/* Right scroll button */}
        <button
            onClick={handleNext}
            className={`absolute right-0 z-10 p-2 bg-white shadow-md rounded-full transition-opacity duration-200 ${
                currentPage >= totalPages - 1 ? 'opacity-0 cursor-default' : 'hover:bg-gray-50'
            }`}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next categories"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Page indicators */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {Array.from({ length: totalPages }).map((_, index) => (
              <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      currentPage === index ? 'bg-black' : 'bg-gray-300'
                  }`}
              />
          ))}
        </div>
      </div>
  );
};

export default CategorySlider;
