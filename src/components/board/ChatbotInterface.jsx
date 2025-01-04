import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send, Trees, UserCircle, X } from 'lucide-react';
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";

// Lex V2 설정
const lexClient = new LexRuntimeV2Client({
  region: import.meta.env.VITE_AWS_REGION, // 이미 환경변수로 있는 region 사용
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

const ChatbotInterface = () => {
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
  const [sessionId, setSessionId] = useState(Date.now().toString());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const sendMessageToLex = async (message) => {
    try {
      const params = {
        botId: "V438YYOP6T", // 봇 ID
        botAliasId: "TSTALIASID", // 봇 별칭 ID
        localeId: "ko_KR",
        sessionId: sessionId,
        text: message
      };

      const command = new RecognizeTextCommand(params);
      const response = await lexClient.send(command);

      return {
        text: response.messages?.[0]?.content || '죄송하지만 질문을 이해하기 어렵네요. \'[키워드] 관련 게시글 찾아줘\', \'[키워드]에 대해 알고 싶어\'와 같은 형식으로 질문해 주시면 더 정확한 검색 결과를 제공해 드릴 수 있습니다. 예를 들어 \'AI 관련 게시글 찾아줘\'처럼 말씀해 주세요.',
        sessionId: response.sessionId
      };
    } catch (err) {
      console.error('Lex 통신 중 에러:', err);
      throw new Error('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      setError(null);
      setIsLoading(true);

      const userMessage = {
        id: Date.now(),
        text: inputText.trim(),
        isBot: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText("");

      try {
        const response = await sendMessageToLex(userMessage.text);
        setSessionId(response.sessionId);

        const botMessage = {
          id: Date.now() + 1,
          text: response.text,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
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

export default ChatbotInterface;
