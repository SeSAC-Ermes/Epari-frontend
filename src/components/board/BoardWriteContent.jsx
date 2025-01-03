import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TinyEditor from '../editor/TinyEditor';
import ToastEditor from '../editor/ToastEditor';
import EditorTabs from '../editor/EditorTabs';
import { useAuth } from '../../auth/AuthContext';

const BoardWriteContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ALL');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [editorContents, setEditorContents] = useState({
    tiny: '',
    toast: ''
  });
  const [activeTab, setActiveTab] = useState('tiny');
  const [tempImages, setTempImages] = useState(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalPost, setOriginalPost] = useState(null);

  const categories = [
    { value: 'ALL', label: '전체' },
    { value: 'MY', label: 'My 게시글' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Security', label: 'Security' },
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Database', label: 'Database' },
    { value: 'Blockchain', label: 'Blockchain' }
  ];

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 수정 모드 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editPostId = searchParams.get('edit');

    if (editPostId) {
      setIsEditMode(true);
      fetchPost(editPostId);
    }

    return () => {
      // Cleanup any pending state updates
      setOriginalPost(null);
      setTitle('');
      setCategory('ALL');
      setTags([]);
      setEditorContents({ tiny: '', toast: '' });
    };
  }, [location]);

  const fetchPost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('게시글을 불러올 수 없습니다.');

      const post = await response.json();

      if (isMounted.current) {
        setOriginalPost(post);
        setTitle(post.title);
        setCategory(post.category || 'ALL');
        setTags(post.tags || []);
        setEditorContents(prev => ({
          ...prev,
          [post.editorType || 'tiny']: post.content
        }));
        setActiveTab(post.editorType || 'tiny');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      if (isMounted.current) {
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/board');
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim() || !editorContents[activeTab].trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedContent = await processImages(editorContents[activeTab]);

      if (!isMounted.current) return; // Exit if component is unmounted

      const endpoint = isEditMode
          ? `/api/posts/${originalPost.PK.split('#')[1]}`
          : `/api/posts`;

      const method = isEditMode ? 'PUT' : 'POST';

      const postData = {
        title,
        content: updatedContent,
        category,
        tags,
        editorType: activeTab,
        author: {
          id: user.username,
          name: user.attributes?.name || user.username
        }
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!isMounted.current) return; // Exit if component is unmounted

      if (!response.ok) throw new Error('게시글 저장에 실패했습니다.');

      navigate('/board');
    } catch (error) {
      console.error('Error saving post:', error);
      if (isMounted.current) {
        alert('게시글 저장에 실패했습니다.');
        setIsSubmitting(false);
      }
    }
  };

  const processImages = async (content) => {
    if (!content.includes('data-filename')) return content;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img[data-filename]');

    for (const img of images) {
      if (!isMounted.current) return content; // Exit if component is unmounted

      const fileName = img.getAttribute('data-filename');
      const blob = tempImages.get(fileName);

      if (blob) {
        try {
          const response = await fetch('/api/uploads/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileType: '.png',
              contentType: 'image/png',
              key: fileName,
              source: fileName.startsWith('drawings/') ? 'drawing' : 'image'
            })
          });

          if (!isMounted.current) return content; // Exit if component is unmounted

          if (!response.ok) throw new Error('Failed to get presigned URL');

          const { uploadUrl } = await response.json();
          await fetch(uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': 'image/png' }
          });

          if (isMounted.current) {
            img.src = uploadUrl.split('?')[0];
            img.removeAttribute('data-filename');
          }
        } catch (error) {
          console.error('Error processing image:', error);
          if (isMounted.current) {
            alert('이미지 업로드에 실패했습니다.');
          }
        }
      }
    }

    return doc.body.innerHTML;
  };

  const handleContentChange = (content) => {
    setEditorContents(prev => ({
      ...prev,
      [activeTab]: content
    }));
  };

  const handleTempImageAdd = (fileName, blob) => {
    setTempImages(prev => new Map(prev.set(fileName, blob)));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleCancel = () => {
    if (isEditMode || title || editorContents[activeTab]) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
        navigate('/board');
      }
    } else {
      navigate('/board');
    }
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="mb-6">
            <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2" size={20}/>
              목록으로
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              >
                {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <EditorTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
              </div>
              <div className="min-h-[400px]">
                {activeTab === 'tiny' ? (
                    <TinyEditor
                        content={editorContents.tiny}
                        onChange={handleContentChange}
                        onTempImageAdd={handleTempImageAdd}
                    />
                ) : (
                    <ToastEditor
                        content={editorContents.toast}
                        onChange={handleContentChange}
                    />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                  #{tag}
                      <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                    ×
                  </button>
                </span>
                ))}
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="태그를 입력하고 엔터를 누르세요"
                    className="flex-1 min-w-[200px] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isSubmitting}
              >
                취소
              </button>
              <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : (isEditMode ? '수정하기' : '작성하기')}
              </button>
            </div>
          </form>
        </div>
      </main>
  );
};

export default BoardWriteContent;
