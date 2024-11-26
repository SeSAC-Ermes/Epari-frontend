import React from "react";

/**
 * 이미지 업로드 공지사항
 */

const UploadGuide = () => {
  return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">이미지 업로드 주의사항</h3>
        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
          <li>이미지 크기는 5MB를 초과할 수 없습니다.</li>
          <li>지원 형식: JPG, PNG, GIF</li>
          <li>이미지는 문제당 1개만 업로드 가능합니다.</li>
          <li>업로드한 이미지는 미리보기로 확인할 수 있습니다.</li>
        </ul>
      </div>
  );
};

export default UploadGuide;
