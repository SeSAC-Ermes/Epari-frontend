import { useCallback, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import { v4 as uuidv4 } from 'uuid';
import 'highlight.js/styles/atom-one-dark.css';
import boardApiClient from '../../api/boardAxios';


function TinyEditor({ content, onChange, onTempImageAdd }) {
  const editorRef = useRef(null);
  const [showDrawing, setShowDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState(null);
  const [showCarbon, setShowCarbon] = useState(false);
  const [carbonCode, setCarbonCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Excalidraw 데이터 변경 핸들러
  const handleDrawingChange = useCallback((elements, state) => {
    setDrawingData({
      elements,
      appState: {
        ...state,
        collaborators: null,
        currentItemFontFamily: 0,
        selectedElementIds: {},
        width: undefined,
        height: undefined
      }
    });
  }, []);

  // 드로잉 저장 핸들러
  const handleDrawingSave = async (e) => {
    e?.preventDefault(); // 폼 제출 방지
    if (!drawingData) return;

    try {
      // 드로잉을 캔버스로 변환
      const canvas = await exportToCanvas({
        elements: drawingData.elements,
        appState: drawingData.appState,
        files: null,
      });

      // 캔버스를 Blob으로 변환
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

      // drawing 폴더에 저장될 파일명 생성
      const fileName = `drawings/${uuidv4()}.png`;

      // 임시 URL 생성 (미리보기용)
      const tempUrl = URL.createObjectURL(blob);

      // 임시 저장소에 Blob 저장
      onTempImageAdd(fileName, blob);

      // 에디터에 이미지 삽입 (임시 URL과 파일명 속성 포함)
      if (editorRef.current) {
        editorRef.current.execCommand('mceInsertContent', false,
            `<img src="${tempUrl}" data-filename="${fileName}" alt="drawing" style="max-width: 100%; height: auto;" />`
        );
      }

      setShowDrawing(false);
      setDrawingData(null);
    } catch (error) {
      console.error('드로잉 저장 실패:', error);
    }
  };

  // 코드 스니펫 저장 핸들러
  const handleCarbonSave = async () => {
    if (!carbonCode || !editorRef.current) return;

    try {
      setIsLoading(true);
      const { data } = await boardApiClient.post('/carbon/generate', {
        code: carbonCode
      });

      // 에디터에 코드 이미지 삽입
      editorRef.current.selection.setContent(
          `<img src="${data.url}" alt="code" style="max-width: 100%;" />`
      );

      setShowCarbon(false);
      setCarbonCode('');
    } catch (error) {
      console.error('코드 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 에디터 초기화 시 커스텀 버튼 추가
  const handleInit = (evt, editor) => {
    editorRef.current = editor;
    editor.ui.registry.addButton('drawing', {
      text: 'Drawing',
      tooltip: '그리기 도구',
      onAction: () => setShowDrawing(true)
    });
    editor.ui.registry.addButton('carbon', {
      text: 'Code',
      tooltip: '코드 스니펫',
      onAction: () => setShowCarbon(true)
    });
  };

  return (
      <>
        <div className="min-h-[400px]">
          <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={handleInit}
              value={content}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'searchreplace', 'visualblocks', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount',
                  'codesample'
                ],
                toolbar: 'undo redo | drawing carbon | fullscreen | ' +
                    'blocks | bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'image media | table | codesample | removeformat | help',
                content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px }',
                // 일반 이미지 업로드 핸들러도 임시 저장소 사용
                images_upload_handler: async (blobInfo) => {
                  const fileName = `images/${uuidv4()}-${blobInfo.filename()}`;
                  try {
                    // 1. presigned URL 요청
                    const { data } = await boardApiClient.post('/uploads/presigned-url', {
                      fileType: '.png',
                      contentType: 'image/png',
                      key: fileName,
                      source: fileName.startsWith('drawings/') ? 'drawing' : 'image'
                    });

                    // 2. S3에 이미지 업로드
                    const s3Response = await fetch(data.uploadUrl, {
                      method: 'PUT',
                      body: blobInfo.blob(),
                      headers: { 'Content-Type': 'image/png' }
                    });

                    if (!s3Response.ok) {
                      throw new Error('Failed to upload image to S3');
                    }

                    // 3. 업로드된 이미지 URL 반환
                    return data.uploadUrl.split('?')[0];
                  } catch (error) {
                    console.error('이미지 업로드 실패:', error);
                    throw error;
                  }
                }
              }}
              onEditorChange={onChange}
          />
        </div>

        {/* 드로잉 모달 */}
        {showDrawing && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto">
              <div
                  className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                     onClick={() => setShowDrawing(false)}/>
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[900px] sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">드로잉</h3>
                      <div className="space-x-2">
                        <button
                            onClick={handleDrawingSave}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                          저장
                        </button>
                        <button
                            onClick={() => {
                              setShowDrawing(false);
                              setDrawingData(null);
                            }}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                    <div style={{ height: "500px", width: "100%" }}>
                      <Excalidraw
                          onChange={handleDrawingChange}
                          theme="light"
                          initialData={{
                            elements: [],
                            appState: {
                              viewBackgroundColor: "#ffffff",
                              currentItemFontFamily: 0
                            }
                          }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* 코드 스니펫 모달 */}
        {showCarbon && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto">
              <div
                  className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                     onClick={() => setShowCarbon(false)}/>
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[900px] sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">코드 삽입</h3>
                      <div className="space-x-2">
                        <button
                            onClick={handleCarbonSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                          {isLoading ? '생성 중...' : '삽입'}
                        </button>
                        <button
                            onClick={() => {
                              setShowCarbon(false);
                              setCarbonCode('');
                            }}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                    <textarea
                        value={carbonCode}
                        onChange={(e) => setCarbonCode(e.target.value)}
                        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        placeholder="코드를 여기에 붙여넣으세요..."
                    />
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
}

export default TinyEditor;
