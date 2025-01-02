function EditorTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center space-x-4 p-4">
      <span className={`text-sm font-medium transition-colors duration-200 ${
        activeTab === 'tiny' ? 'text-blue-600' : 'text-gray-500'
      }`}>
        Rich Text
      </span>

      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={activeTab === 'toast'}
          onChange={(e) => onTabChange(e.target.checked ? 'toast' : 'tiny')}
        />
        <div className="relative">
          <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner">
            <div className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
              activeTab === 'toast' ? 'translate-x-5' : 'translate-x-1'
            }`} style={{ top: '2px' }} />
          </div>
        </div>
      </label>

      <span className={`text-sm font-medium transition-colors duration-200 ${
        activeTab === 'toast' ? 'text-blue-600' : 'text-gray-500'
      }`}>
        Markdown
      </span>
    </div>
  );
}

export default EditorTabs; 