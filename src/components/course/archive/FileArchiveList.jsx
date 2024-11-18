import React, { useMemo, useState } from 'react';
import { ArrowUp, CheckCircle, Download, Search } from 'lucide-react';

/**
 * 강의 자료실의 파일 목록을 표시하고 관리하는 컴포넌트
 */

const FileArchiveList = ({ files, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredFiles = files.filter(file =>
      file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 각 콘텐츠별 전체 파일 키 생성
  const getContentFileKeys = (fileId) => {
    const content = filteredFiles.find(f => f.id === fileId);
    return content ? content.files.map(attachment => `${fileId}-${attachment.id}`) : [];
  };

  // 콘텐츠의 모든 파일이 선택되었는지 확인
  const isContentFullySelected = (fileId) => {
    const contentFileKeys = getContentFileKeys(fileId);
    return contentFileKeys.length > 0 &&
        contentFileKeys.every(key => selectedFiles.includes(key));
  };

  // 콘텐츠의 일부 파일만 선택되었는지 확인
  const isContentPartiallySelected = (fileId) => {
    const contentFileKeys = getContentFileKeys(fileId);
    return contentFileKeys.some(key => selectedFiles.includes(key)) &&
        !isContentFullySelected(fileId);
  };

  const handleSelect = (id) => {
    const contentFileKeys = getContentFileKeys(id);

    if (isContentFullySelected(id)) {
      // 모든 파일이 선택된 경우, 해제
      setSelectedFiles(prev => prev.filter(key => !contentFileKeys.includes(key)));
      setSelectedItems(prev => prev.filter(item => item !== id));
    } else {
      // 그렇지 않은 경우, 모든 파일 선택
      setSelectedFiles(prev => {
        // 기존에 선택된 개별 파일들 제거
        const filteredPrev = prev.filter(key => !contentFileKeys.includes(key));
        return [...filteredPrev, ...contentFileKeys];
      });
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const handleSelectFile = (fileId, attachmentId) => {
    const key = `${fileId}-${attachmentId}`;

    // 이미 콘텐츠 전체가 선택된 경우, 콘텐츠 전체 선택을 해제하고 나머지 파일들만 개별 선택
    if (selectedItems.includes(fileId)) {
      const contentFileKeys = getContentFileKeys(fileId);
      const otherFiles = contentFileKeys.filter(k => k !== key);

      setSelectedItems(prev => prev.filter(item => item !== fileId));
      setSelectedFiles(prev => {
        const filteredPrev = prev.filter(k => !contentFileKeys.includes(k));
        return [...filteredPrev, ...otherFiles];
      });
    } else {
      // 일반적인 파일 토글
      setSelectedFiles(prev =>
          prev.includes(key)
              ? prev.filter(item => item !== key)
              : [...prev, key]
      );
    }
  };

  const handleSelectAll = () => {
    const allFileKeys = filteredFiles.flatMap(file =>
        file.files.map(attachment => `${file.id}-${attachment.id}`)
    );

    if (selectedFiles.length === allFileKeys.length) {
      setSelectedFiles([]);
      setSelectedItems([]);
    } else {
      setSelectedFiles(allFileKeys);
      setSelectedItems([]);
    }
  };

  const isAllSelected = useMemo(() => {
    const allFileKeys = filteredFiles.flatMap(file =>
        file.files.map(attachment => `${file.id}-${attachment.id}`)
    );
    return allFileKeys.length > 0 && allFileKeys.length === selectedFiles.length;
  }, [filteredFiles, selectedFiles]);

  // 실제 선택된 아이템 수 계산 (중복 제거)
  const totalSelectedCount = useMemo(() => {
    const selectedFilesSet = new Set(); // 중복 제거를 위한 Set 사용

    // 전체 선택된 콘텐츠의 파일들 추가
    selectedItems.forEach(id => {
      const content = filteredFiles.find(f => f.id === id);
      if (content) {
        content.files.forEach(file => {
          selectedFilesSet.add(`${id}-${file.id}`);
        });
      }
    });

    // 개별 선택된 파일들 중 전체 선택에 포함되지 않은 것만 추가
    selectedFiles.forEach(fileKey => {
      const [contentId] = fileKey.split('-');
      if (!selectedItems.includes(contentId)) {
        selectedFilesSet.add(fileKey);
      }
    });

    return selectedFilesSet.size; // 중복이 제거된 실제 선택된 파일 수
  }, [selectedItems, selectedFiles, filteredFiles]);

  const getDownloadItems = () => {
    const downloadItems = new Set(); // 중복 제거를 위한 Set

    // 1. 전체 선택된 콘텐츠의 파일들
    selectedItems.forEach(id => {
      const content = filteredFiles.find(f => f.id === id);
      if (content) {
        downloadItems.add({ type: 'content', id });
      }
    });

    // 2. 개별 선택된 파일들 (전체 선택된 콘텐츠에 포함되지 않은 것만)
    selectedFiles.forEach(fileKey => {
      const [contentId, fileId] = fileKey.split('-');
      if (!selectedItems.includes(contentId)) {
        downloadItems.add({ type: 'file', contentId, fileId });
      }
    });

    return Array.from(downloadItems);
  };

  // 스크롤 이벤트 핸들러 추가
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">자료실</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <input
                    type="text"
                    placeholder="자료 검색..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
              </div>
              <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <CheckCircle
                    size={16}
                    className={isAllSelected ? "text-green-500" : "text-gray-400"}
                />
                <span>전체 선택</span>
              </button>
              <button
                  onClick={() => onDownload(getDownloadItems())}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors
                    ${totalSelectedCount > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={totalSelectedCount === 0}
              >
                <Download size={16}/>
                <span>다운로드 {totalSelectedCount > 0 && `(${totalSelectedCount})`}</span>
              </button>
            </div>
          </div>

          <div className="border rounded-lg mb-4">
            <div className="grid grid-cols-4 p-4 font-medium text-sm text-gray-600">
              <div className="font-bold">생성일자</div>
              <div className="col-span-3 font-bold">제목</div>
            </div>
          </div>


          <div className="space-y-4">
            {filteredFiles.map((file) => (
                <div key={file.id} className="border rounded-lg">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-4 items-center">
                      <div className="text-sm text-gray-600">{file.createdAt}</div>
                      <div className="col-span-3">
                        <span className="text-sm font-medium text-gray-900">{file.title}</span>
                      </div>
                    </div>
                    <button
                        className="mx-4 p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => handleSelect(file.id)}
                    >
                      <CheckCircle
                          size={20}
                          className={
                            isContentFullySelected(file.id) || selectedItems.includes(file.id)
                                ? "text-green-500"
                                : isContentPartiallySelected(file.id)
                                    ? "text-green-300"
                                    : "text-gray-300"
                          }
                      />
                    </button>
                  </div>

                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="mt-4 space-y-2">
                      {file.files.map((attachment) => (
                          <div
                              key={attachment.id}
                              className="flex items-center p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-600">
                          {attachment.originalFileName || attachment.name}
                        </span>
                              <span className="text-xs text-gray-400">({attachment.fileSize})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload([{ type: 'file', contentId: file.id, fileId: attachment.id }]);
                                  }}
                                  className="text-blue-500 hover:text-blue-600"
                              >
                                <Download size={16}/>
                              </button>
                              <button
                                  className="p-1 hover:bg-gray-100 rounded-full"
                                  onClick={() => handleSelectFile(file.id, attachment.id)}
                              >
                                <CheckCircle
                                    size={16}
                                    className={
                                      selectedFiles.includes(`${file.id}-${attachment.id}`) || selectedItems.includes(file.id)
                                          ? "text-green-500"
                                          : "text-gray-300"
                                    }
                                />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 자료가 없습니다.
              </div>
          )}
        </div>

        {/* ScrollToTop 버튼 추가 */}
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-[9999]"
            aria-label="페이지 최상단으로 이동"
        >
          <ArrowUp size={24} />
        </button>

      </main>
  );
};

export default FileArchiveList;
