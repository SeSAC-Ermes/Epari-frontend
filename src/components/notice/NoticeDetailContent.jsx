import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NoticeApi } from '../../api/notice/NoticeApi';
import { Download, FileText } from 'lucide-react';

const NoticeDetailContent = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasIncreased, setHasIncreased] = useState(false);

  // 이미지 파일 확장자 체크
  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  // 조회수 증가 함수
  const increaseViewCount = async () => {
    if (!hasIncreased) {
      try {
        await NoticeApi.increaseViewCount(noticeId);
        setHasIncreased(true);
      } catch (err) {
        // 에러가 발생해도 계속 진행
        console.warn('조회수 증가 실패:', err);
      }
    }
  };

  //
  // const increaseViewCount = async () => {
  //   if (!hasIncreased) {
  //     try {
  //       await NoticeApi.increaseViewCount(noticeId);
  //       setHasIncreased(true);
  //     } catch (err) {
  //       console.error('조회수 증가 실패:', err);
  //     }
  //   }
  // };

  // 공지사항 데이터 가져오기
  const fetchNotice = async () => {
    try {
      const response = await NoticeApi.getNotice(noticeId);
      setNotice(response);
      setError(null);
    } catch (err) {
      console.error('공지사항 조회 실패:', err);
      setError(err.message || '공지사항을 불러오는데 실패했습니다.');
      setNotice(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const initializeNotice = async () => {
      try {
        setLoading(true);
        setError(null);
        setHasIncreased(false);

        // 동시에 실행하지 않고 순차적으로 실행
        await increaseViewCount();
        await fetchNotice();
      } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        setError('페이지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializeNotice();
  }, [noticeId]);

  // 파일 다운로드 핸들러
  const handleFileDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`/api/files/notices/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰이 필요한 경우
        }
      });

      if (!response.ok) {
        throw new Error('파일 다운로드 실패');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;  // 원본 파일명으로 다운로드
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };
  // const handleFileDownload = async (fileId) => {
  //   try {
  //     const presignedUrl = await NoticeApi.getFilePresignedUrl(noticeId, fileId);
  //     window.open(presignedUrl, '_blank');
  //   } catch (error) {
  //     console.error('파일 다운로드 중 오류 발생:', error);
  //     alert('파일 다운로드에 실패했습니다.');
  //   }
  // };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
    );
  }

  if (!notice) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">공지사항을 찾을 수 없습니다.</div>
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
            <div className="flex justify-between text-sm text-gray-500">
              <div className="flex gap-4">
                <span>작성자: {notice.instructorName}</span>
                <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
              <span>조회수: {notice.viewCount}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>

          {/* 이미지 파일 미리보기 섹션 */}
          {notice.files?.some(file => isImageFile(file.originalFileName)) && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                {notice.files
                    .filter(file => isImageFile(file.originalFileName))
                    .map(file => (
                        <div key={file.id} className="relative aspect-video">
                          <img
                              src={`/api/files/notices/${file.storedFileName}`}
                              alt={file.originalFileName}
                              className="rounded-lg object-contain w-full h-full"
                              onError={(e) => {
                                console.error('Image loading error:', e);
                                e.target.style.display = 'none';
                              }}
                          />
                        </div>
                    ))}
              </div>
          )}

          {/* 첨부파일 섹션 */}
          {notice.files?.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">첨부파일</h3>
                <ul className="space-y-2">
                  {notice.files.map((file) => (
                      <li
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-gray-400"/>
                          <span className="text-sm">
                      {file.originalFileName}
                            {file.fileSize && (
                                <span className="text-gray-500 ml-2">
                          ({Math.round(file.fileSize / 1024)} KB)
                        </span>
                            )}
                    </span>
                        </div>
                        {/*<button*/}
                        {/*    onClick={() => handleFileDownload(file.id)}*/}
                        {/*    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-50"*/}
                        {/*>*/}
                        {/*  <Download size={16}/>*/}
                        {/*  <span>다운로드</span>*/}
                        {/*</button>*/}

                        <button
                            onClick={() => handleFileDownload(file.id, file.originalFileName)}
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-50"
                        >
                          <Download size={16}/>
                          <span>다운로드</span>
                        </button>


                      </li>
                  ))}
                </ul>
              </div>
          )}
        </div>
      </main>
  );
};

export default NoticeDetailContent;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { NoticeApi } from '../../api/notice/NoticeApi';
// import { Download, FileText } from 'lucide-react';
//
// const NoticeDetailContent = () => {
//   const { noticeId } = useParams();
//   const [notice, setNotice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//
//   // 이미지 파일 확장자 체크
//   const isImageFile = (fileName) => {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
//     const extension = fileName?.split('.').pop()?.toLowerCase();
//     return imageExtensions.includes(extension);
//   };
//
//   useEffect(() => {
//     const fetchNotice = async () => {
//       try {
//         setLoading(true);
//         const response = await NoticeApi.getNotice(noticeId);
//         setNotice(response);
//
//         // 이미지 파일의 presigned URL을 가져옴
//         if (response.files) {
//           const imageFiles = response.files.filter(file => isImageFile(file.originalFileName));
//           const urlPromises = imageFiles.map(async (file) => {
//             try {
//               const presignedUrl = await NoticeApi.getFilePresignedUrl(noticeId, file.id);
//               return { [file.id]: presignedUrl };
//             } catch (error) {
//               console.error('Error getting presigned URL:', error);
//               return { [file.id]: null };
//             }
//           });
//
//           const urls = await Promise.all(urlPromises);
//           setImageUrls(urls.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
//         }
//       } catch (err) {
//         console.error('Error fetching notice:', err);
//         setError('공지사항을 불러오는데 실패했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     // 조회수 증가 함수를 별도로 분리
//     const increaseViewCount = async () => {
//       try {
//         await NoticeApi.increaseViewCount(noticeId);
//       } catch (err) {
//         console.error('Error increasing view count:', err);
//       }
//     };
//
//     // 먼저 조회수를 증가시킨 후 공지사항을 가져옴
//     const initializeNotice = async () => {
//       await increaseViewCount();
//       await fetchNotice();
//     };
//
//     initializeNotice();
//   }, [noticeId]);
//
//   // 파일 다운로드 핸들러
//   const handleFileDownload = async (fileId) => {
//     try {
//       const presignedUrl = await NoticeApi.getFilePresignedUrl(noticeId, fileId);
//       window.open(presignedUrl, '_blank');
//     } catch (error) {
//       console.error('파일 다운로드 중 오류 발생:', error);
//       alert('파일 다운로드에 실패했습니다.');
//     }
//   };
//
//   if (loading) {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//         </div>
//     );
//   }
//
//   if (error) {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-red-500">{error}</div>
//         </div>
//     );
//   }
//
//   if (!notice) {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-gray-500">공지사항을 찾을 수 없습니다.</div>
//         </div>
//     );
//   }
//
//   return (
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg p-6">
//           <div className="border-b pb-4 mb-6">
//             <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
//             <div className="flex justify-between text-sm text-gray-500">
//               <div className="flex gap-4">
//                 <span>작성자: {notice.instructorName}</span>
//                 <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
//               </div>
//               <span>조회수: {notice.viewCount}</span>
//             </div>
//           </div>
//
//           <div className="prose max-w-none mb-6">
//             <div dangerouslySetInnerHTML={{ __html: notice.content }} />
//           </div>
//
//           {/* 이미지 파일 미리보기 섹션 */}
//           {notice.files?.some(file => isImageFile(file.originalFileName)) && (
//               <div className="mb-6 grid grid-cols-2 gap-4">
//                 {notice.files
//                     .filter(file => isImageFile(file.originalFileName))
//                     .map(file => (
//                         <div key={file.id} className="relative aspect-video">
//                           {imageUrls[file.id] && (
//                               <img
//                                   src={imageUrls[file.id]}
//                                   alt={file.originalFileName}
//                                   className="rounded-lg object-cover w-full h-full"
//                               />
//                           )}
//                         </div>
//                     ))}
//               </div>
//           )}
//
//           {/* 첨부파일 섹션 */}
//           {notice.files?.length > 0 && (
//               <div className="border-t pt-4">
//                 <h3 className="font-medium mb-2">첨부파일</h3>
//                 <ul className="space-y-2">
//                   {notice.files.map((file) => (
//                       <li
//                           key={file.id}
//                           className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
//                       >
//                         <div className="flex items-center gap-2">
//                           <FileText size={20} className="text-gray-400" />
//                           <span className="text-sm">
//                       {file.originalFileName}
//                             {file.fileSize && (
//                                 <span className="text-gray-500 ml-2">
//                           ({Math.round(file.fileSize / 1024)} KB)
//                         </span>
//                             )}
//                     </span>
//                         </div>
//                         <button
//                             onClick={() => handleFileDownload(file.id)}
//                             className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-50"
//                         >
//                           <Download size={16} />
//                           <span>다운로드</span>
//                         </button>
//                       </li>
//                   ))}
//                 </ul>
//               </div>
//           )}
//         </div>
//       </main>
//   );
// };
//
// export default NoticeDetailContent;
