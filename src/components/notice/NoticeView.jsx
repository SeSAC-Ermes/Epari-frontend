//필요 없는 파일일 듯...??

// import React, { useState } from 'react';
// import { PenSquare, Trash2 } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useRouter } from 'next/router';
// import { useToast } from "@/components/ui/use-toast";
// import noticeApi from '@/api/noticeApi';
//
// const NoticeView = () => {
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const router = useRouter();
//   const { id } = router.query;
//   const { toast } = useToast();
//
//   const handleDelete = async () => {
//     try {
//       await noticeApi.deleteNotice(id);
//
//       toast({
//         title: "공지사항이 삭제되었습니다.",
//         variant: "success",
//       });
//
//       // 목록 페이지로 이동
//       router.push('/notices');
//     } catch (error) {
//       toast({
//         title: "삭제 실패",
//         description: "공지사항 삭제 중 오류가 발생했습니다.",
//         variant: "destructive",
//       });
//       console.error('삭제 중 오류 발생:', error);
//     }
//   };
//
//   return (
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//         {/* 기존 공지사항 내용 */}
//         <h1 className="text-2xl font-bold mb-4">강의 시작 안내</h1>
//         <div className="text-sm text-gray-600 mb-2 flex justify-between">
//           <div>
//             <span>작성자: 윤강사</span>
//             <span className="mx-4">작성일: 2024. 11. 20.</span>
//             <span>조회수: 6</span>
//           </div>
//         </div>
//         <p className="text-gray-800 mb-8">
//           다음 주부터 새로운 강의가 시작됩니다. 수업 시간을 확인해 주세요.
//         </p>
//
//         {/* 수정/삭제 버튼 컨트롤 */}
//         <div className="flex justify-end gap-2 mt-4">
//           <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors">
//             <PenSquare size={18} />
//             <span>수정</span>
//           </button>
//           <button
//               onClick={() => setIsDeleteDialogOpen(true)}
//               className="flex items-center gap-1 px-4 py-2 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
//           >
//             <Trash2 size={18} />
//             <span>삭제</span>
//           </button>
//         </div>
//
//         {/* 삭제 확인 다이얼로그 */}
//         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
//               <AlertDialogDescription>
//                 이 공지사항을 삭제하시겠습니까?
//                 삭제된 공지사항은 복구할 수 없습니다.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>취소</AlertDialogCancel>
//               <AlertDialogAction
//                   onClick={handleDelete}
//                   className="bg-rose-600 hover:bg-rose-700"
//               >
//                 삭제
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//   );
// };
//
// export default NoticeView;
//
// // import React, { useState } from 'react';
// // import { PenSquare, Trash2 } from 'lucide-react';
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { useRouter } from 'next/router';
// // import { useToast } from "@/components/ui/use-toast";
// // import noticeApi from '@/api/noticeApi';
// //
// // const NoticeView = ({ noticeId }) => {
// //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
// //   const router = useRouter();
// //   const { toast } = useToast();
// //
// //   const handleDelete = async () => {
// //     try {
// //       await noticeApi.deleteNotice(noticeId);
// //
// //       toast({
// //         title: "공지사항이 삭제되었습니다.",
// //         variant: "success",
// //       });
// //
// //       // 목록 페이지로 이동
// //       router.push('/notices');
// //     } catch (error) {
// //       toast({
// //         title: "삭제 실패",
// //         description: "공지사항 삭제 중 오류가 발생했습니다.",
// //         variant: "destructive",
// //       });
// //       console.error('삭제 중 오류 발생:', error);
// //     }
// //   };
// //
// //   return (
// //       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
// //         {/* 기존 공지사항 내용 */}
// //         <h1 className="text-2xl font-bold mb-4">강의 시작 안내</h1>
// //         <div className="text-sm text-gray-600 mb-2 flex justify-between">
// //           <div>
// //             <span>작성자: 윤강사</span>
// //             <span className="mx-4">작성일: 2024. 11. 20.</span>
// //             <span>조회수: 6</span>
// //           </div>
// //         </div>
// //         <p className="text-gray-800 mb-8">
// //           다음 주부터 새로운 강의가 시작됩니다. 수업 시간을 확인해 주세요.
// //         </p>
// //
// //         {/* 수정/삭제 버튼 컨트롤 */}
// //         <div className="flex justify-end gap-2 mt-4">
// //           <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors">
// //             <PenSquare size={18} />
// //             <span>수정</span>
// //           </button>
// //           <button
// //               onClick={() => setIsDeleteDialogOpen(true)}
// //               className="flex items-center gap-1 px-4 py-2 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
// //           >
// //             <Trash2 size={18} />
// //             <span>삭제</span>
// //           </button>
// //         </div>
// //
// //         {/* 삭제 확인 다이얼로그 */}
// //         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
// //           <AlertDialogContent>
// //             <AlertDialogHeader>
// //               <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
// //               <AlertDialogDescription>
// //                 이 공지사항을 삭제하시겠습니까?
// //                 삭제된 공지사항은 복구할 수 없습니다.
// //               </AlertDialogDescription>
// //             </AlertDialogHeader>
// //             <AlertDialogFooter>
// //               <AlertDialogCancel>취소</AlertDialogCancel>
// //               <AlertDialogAction
// //                   onClick={handleDelete}
// //                   className="bg-rose-600 hover:bg-rose-700"
// //               >
// //                 삭제
// //               </AlertDialogAction>
// //             </AlertDialogFooter>
// //           </AlertDialogContent>
// //         </AlertDialog>
// //       </div>
// //   );
// // };
// //
// // export default NoticeView;
