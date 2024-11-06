import React, { useState } from 'react';
import { X } from 'lucide-react';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
              type="file"
              onChange={handleFileChange}
              className="w-full"
          />
          {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span>{file.name}</span>
                <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default FileUpload;
