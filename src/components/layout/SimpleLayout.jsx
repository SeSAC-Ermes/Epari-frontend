import TopBar from "./TopBar.jsx";
import { Outlet } from "react-router-dom";

/**
 * TopBar만 포함하는 단순 레이아웃 컴포넌트
 */
const SimpleLayout = () => {
  return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <TopBar/>
        <div className="max-w-7xl mx-auto px-4">
          <Outlet/>
        </div>
      </div>
  );
};
export default SimpleLayout;
