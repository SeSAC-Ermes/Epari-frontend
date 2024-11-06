import React from 'react';
import {Search} from 'lucide-react';

/**
 * 재사용 가능한 Header 컴포넌트
 * props로 title을 전달받아 페이지별로 다른 제목을 표시할 수 있게 구현
 */

const Header = ({title}) => (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="relative">
        <input
            type="text"
            placeholder="검색"
            className="pl-3 pr-8 py-1 border rounded-md text-sm"
        />
        <Search className="absolute right-2 top-1.5 text-gray-400" size={16}/>
      </div>
    </header>
);

export default Header;
