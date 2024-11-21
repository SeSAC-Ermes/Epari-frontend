import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 공지사항 목록을 테이블 형태로 표시하는 컴포넌트
 * 번호, 제목, 작성자, 날짜, 조회수 정보를 컬럼으로 표시
 * 클릭 시 해당 공지사항의 상세 페이지로 이동
 */
const NoticeTable = ({ notices }) => {
  const navigate = useNavigate();

  // 로딩 상태 처리
  if (!notices || notices.length === 0 || notices[0].id === 'loading') {
    return (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-600 mb-4">공지사항을 불러오는 중입니다...</p>
        </div>
    );
  }

  // 최신 5개의 공지사항만 표시
  const recentNotices = notices.slice(0, 5);

  // 공지사항 클릭 시 상세 페이지로 이동
  const handleNoticeClick = (noticeId) => {
    navigate(`/notices/${noticeId}`);
  };

  return (
      <table className="w-full border-collapse">
        <thead>
        <tr className="border-y bg-gray-100">
          <th className="py-4 text-center w-20">No.</th>
          <th className="py-4 text-center w-96">제목</th>
          <th className="py-4 text-center w-32">작성자</th>
          <th className="py-4 text-center w-32">날짜</th>
          <th className="py-4 text-center w-32">조회수</th>
        </tr>
        </thead>
        <tbody>
        {recentNotices.map((notice) => (
            <tr
                key={notice.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleNoticeClick(notice.id)}
            >
              <td className="py-4 text-center">{notice.displayNumber}</td>
              <td className="py-4 text-center truncate">{notice.title}</td>
              <td className="py-4 text-center">{notice.writer}</td>
              <td className="py-4 text-center">{notice.date}</td>
              <td className="py-4 text-center">{notice.views}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default NoticeTable;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
//
// /**
//  * 공지사항 목록을 테이블 형태로 표시하는 컴포넌트
//  * 번호, 제목, 작성자, 날짜, 조회수 정보를 컬럼으로 표시
//  * 클릭 시 해당 공지사항의 상세 페이지로 이동
//  */
//
// const NoticeTable = ({ notices }) => {
//   const navigate = useNavigate();
//   console.log('notices:', notices); // 데이터 확인용
//
//   // 최신 5개의 공지사항만 표시
//   const recentNotices = notices.slice(0, 5);
//
//   const handleNoticeClick = (noticeId) => {
//     navigate(`/notices/${noticeId}`);
//   };
//
//   return (
//       <table className="w-full">
//         <thead>
//         <tr className="border-y">
//           <th className="py-4 text-center w-20">No.</th>
//           <th className="py-4 text-center w-96">제목</th>
//           <th className="py-4 text-center w-32">작성자</th>
//           <th className="py-4 text-center w-32">날짜</th>
//           <th className="py-4 text-center w-32">조회수</th>
//         </tr>
//         </thead>
//         <tbody>
//         {recentNotices.map((notice) => (
//             <tr
//                 key={notice.id}
//                 className="border-b hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleNoticeClick(notice.id)}
//             >
//               <td className="py-4 text-center">{notice.displayNumber}</td>
//               <td className="py-4 text-center truncate">{notice.title}</td>
//               <td className="py-4 text-center">{notice.instructorName}</td>
//               <td className="py-4 text-center">
//                 {new Date(notice.createdAt).toLocaleDateString()}
//               </td>
//               <td className="py-4 text-center">{notice.viewCount}</td>
//             </tr>
//         ))}
//         </tbody>
//       </table>
//   );
// };
//
// export default NoticeTable;
