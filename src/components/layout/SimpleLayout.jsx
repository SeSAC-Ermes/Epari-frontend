import TopBar from "./TopBar.jsx";
import { Outlet } from "react-router-dom";

/**
 * TopBar만 포함하는 단순 레이아웃 컴포넌트
 */
const SimpleLayout = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <TopBar/>
        <Outlet/>
      </div>
  );
};

export default SimpleLayout;
