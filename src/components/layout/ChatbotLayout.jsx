// src/layouts/BoardLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import ChatbotInterface from "../board/ChatbotInterface.jsx";

const ChatbotLayout = () => {
  const location = useLocation();

  // /board로 시작하는 경로인지 확인
  const isBoardRoute = location.pathname.startsWith('/board');

  return (
      <>
        <Outlet/>
        {isBoardRoute && <ChatbotInterface/>}
      </>
  );
};

export default ChatbotLayout;
