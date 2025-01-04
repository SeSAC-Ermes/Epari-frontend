import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send, Trees, UserCircle, X } from 'lucide-react';

// API 엔드포인트 설정 (변경 없음)
const WEBHOOK_URL = 'https://iampam.app.n8n.cloud/webhook/df161b49-9a7e-42f4-afed-3729402ee737/chat';

const ChatbotInterfaceLegacy = () => {
  // 컴포넌트 상태 관리 (변경 없음)
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 무엇을 도와드릴까요?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // DOM 참조 (변경 없음)
  const messagesEndRef = useRef(null);

  // 새 메시지 추가 시 자동 스크롤 (변경 없음)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 웹훅 API 통신 핸들러 (변경 없음)
  const sendMessageToWebhook = async (message) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: message,
          timestamp: new Date().toISOString(),
          sessionId: 'test'
        }),
      });

      if (!response.ok) {
        throw new Error('API 응답이 실패했습니다.');
      }

      const data = await response.json();
      return data.output || '죄송합니다. 응답을 받지 못했습니다.';
    } catch (err) {
      console.error('API 호출 중 에러:', err);
      throw new Error('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  // 메시지 전송 핸들러 (변경 없음)
  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      setError(null);
      setIsLoading(true);

      // 사용자 메시지 추가
      const userMessage = {
        id: Date.now(),
        text: inputText.trim(),
        isBot: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText("");

      try {
        // n8n 웹훅으로 메시지 전송
        const response = await sendMessageToWebhook(userMessage.text);

        // 봇 응답 추가
        const botMessage = {
          id: Date.now() + 1,
          text: response,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 키보드 이벤트 핸들러 (변경 없음)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-emerald-400 text-white p-4 rounded-full shadow-lg hover:bg-emerald-500 transition-colors"
                aria-label="채팅 열기"
            >
              <MessageCircle size={24}/>
            </button>
        )}

        {isOpen && (
            <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl">
              {/* 헤더 영역 */}
              <div className="flex justify-between items-center px-4 h-14 border-b bg-emerald-400 rounded-t-lg">
                <h3 className="font-semibold text-white">Epari 게시판 AI 도우미</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-100"
                    aria-label="채팅 닫기"
                >
                  <X size={20}/>
                </button>
              </div>

              {/* 메시지 컨테이너 */}
              <div className="h-96 p-4 space-y-6 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-end space-x-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {message.isBot && (
                          <div className="flex-shrink-0 w-8">
                            <Trees className="w-8 h-8 rounded-full bg-emerald-200"/>
                          </div>
                      )}
                      <div
                          className={`max-w-[60%] p-3 rounded-lg ${
                              message.isBot
                                  ? 'bg-emerald-50 text-gray-800 rounded-bl-none'
                                  : 'bg-emerald-400 text-white rounded-br-none'
                          }`}
                      >
                        {message.text}
                      </div>
                      {!message.isBot && (
                          <div className="flex-shrink-0 w-8">
                            <UserCircle className="w-8 h-8 rounded-full bg-emerald-200"/>
                          </div>
                      )}
                    </div>
                ))}
                {error && (
                    <div className="text-center p-2 text-red-500 text-sm bg-red-50 rounded">
                      {error}
                    </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* 입력 영역 */}
              <div className="border-t p-4 bg-gray-50 rounded-b-lg">
                <div className="flex items-center space-x-2">
              <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  disabled={isLoading}
                  className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows="1"
              />
                  <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading}
                      className="bg-emerald-400 text-white p-2 rounded-full hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="메시지 보내기"
                  >
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin"/>
                    ) : (
                        <Send size={20}/>
                    )}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ChatbotInterfaceLegacy;
