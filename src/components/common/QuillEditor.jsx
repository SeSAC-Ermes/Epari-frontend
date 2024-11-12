import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * 텍스트 박스 컴포넌트
 */

const QuillEditor = ({ value, onChange, readOnly = false }) => {
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
    toolbar: readOnly ? false : {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
      <div className="quill-editor">
        <ReactQuill
            ref={quillRef}
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            theme="snow"
        />
      </div>
  );
};

export default QuillEditor;
