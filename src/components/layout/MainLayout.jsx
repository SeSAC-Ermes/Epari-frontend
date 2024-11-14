import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

/**
 * Sidebar, TopBar 컴포넌트를 포함하는 Layout 컴포넌트
 */
const MainLayout = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="flex-1">
          <TopBar/>
          <Outlet/>
        </div>
      </div>
  );
};

export default MainLayout;
