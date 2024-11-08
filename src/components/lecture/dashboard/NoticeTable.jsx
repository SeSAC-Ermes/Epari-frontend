import React from 'react';

const NoticeTable = ({ notices }) => {
  const headers = ['No.', '제목', '작성자', '날짜', '조회수'];

  return (
      <table className="w-full">
        <thead>
        <tr className="border-t border-b">
          {headers.map((header, index) => (
              <th key={index} className="py-3 text-left">
                {header}
              </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {notices.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-3">{item.id}</td>
              <td className="py-3">{item.title}</td>
              <td className="py-3">{item.writer}</td>
              <td className="py-3">{item.date}</td>
              <td className="py-3">{item.views}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default NoticeTable;
