/**
 임시로 만들어둔 과제 제출페이지 더미 컨텐츠
 */

export const AssignmentContainer = ({logo, arrows}) => {
  const logos = {
    react: (
        <svg className="w-12 h-12" viewBox="-11.5 -10.23174 23 20.46348">
          <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
    ),
    node: (
        <svg className="w-12 h-12" viewBox="0 0 24 24">
          <path fill="#539E43"
                d="M12 1.85c-.27 0-.55.07-.78.2L3.78 6.35C3.3 6.63 3 7.15 3 7.7v8.6c0 .55.3 1.07.78 1.35l7.44 4.3c.23.13.5.2.78.2.27 0 .54-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.35V7.7c0-.55-.3-1.07-.78-1.35l-7.44-4.3c-.24-.13-.52-.2-.78-.2zm0 2.97L6.48 8.5 12 12.16l5.52-3.66L12 4.82zm-7 5.29v5.88l5.52 3.19V13.3L5 10.11zm14 0l-5.52 3.19v5.88l5.52-3.19v-5.88z"/>
        </svg>
    ),
    mongodb: (
        <svg className="w-12 h-12" viewBox="0 0 24 24">
          <path fill="#13AA52"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
    )
  };
  return (
      <div className="relative">
        <div className="border-2 rounded-lg p-4 w-32 h-32 flex flex-col items-center justify-center">
          {logos[logo]}
          <span className="mt-2 text-sm">컨테이너</span>
        </div>
        {arrows && (
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
        )}
      </div>
  );
};
