import React from "react";
import { Image, X } from 'lucide-react';

/**
 * 이미지 업로드 폼
 */

const ImageUploader = ({ index, previewImage, onImageChange, onImageRemove }) => {
  return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-center">
          {previewImage ? (
              <div className="relative">
                <img
                    src={previewImage}
                    alt="문제 이미지"
                    className="max-h-48 rounded-lg"
                />
                <button
                    type="button"
                    onClick={() => onImageRemove(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
          ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Image size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500">이미지 추가</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onImageChange(index, e)}
                />
              </label>
          )}
        </div>
      </div>
  );
};

export default ImageUploader;
