import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  // 이미지 업로드 핸들러
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          const imageUrl = data.url;

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
        }
      }
    };
  };

  // 툴바 설정
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }], // 헤더 스타일 (1, 2, 3, 기본)
        ['bold', 'italic', 'underline', 'strike'], // 텍스트 스타일 (굵게, 기울임, 밑줄, 취소선)
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 목록 스타일 (순서 목록, 순서 없는 목록)
        [{ 'align': [] }], // 정렬 (왼쪽, 가운데, 오른쪽)
        ['link', 'image'], // 링크, 이미지 추가
        ['clean'], // 포맷 초기화
      ],
      handlers: {
        image: imageHandler, // 이미지 핸들러 설정
      },
    },
  };

  // 사용할 포맷 지정
  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link', 'image',
  ];

  return (
      <div className="quill-editor">
        <ReactQuill
            ref={quillRef}
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
        />
      </div>
  );
};

export default QuillEditor;
