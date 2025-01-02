function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search posts..." 
          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <i className="fas fa-search text-gray-400"></i>
        </div>
      </div>
    </div>
  );
}

export default SearchBar; 