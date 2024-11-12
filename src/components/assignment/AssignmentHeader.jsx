export const AssignmentHeader = ({ date, title, deadline }) => {
  const calculateDday = (deadlineStr) => {
    if (!deadlineStr) return 'D-Day';

    try {
      // deadline이 문자열로 오는 경우를 대비해 Date 객체로 변환
      const deadlineDate = new Date(deadlineStr);

      // 유효하지 않은 날짜인 경우 체크
      if (isNaN(deadlineDate.getTime())) {
        console.error('Invalid date:', deadlineStr);
        return 'D-Day';
      }

      const today = new Date();
      // 시간을 00:00:00으로 설정하여 날짜만 비교
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return '마감됨';
      if (diffDays === 0) return 'D-Day';
      return `D-${diffDays}`;
    } catch (error) {
      console.error('Error calculating D-day:', error);
      return 'D-Day';
    }
  };

  const dday = calculateDday(deadline);

  return (
      <div className="mb-8">
        <div className="mb-4">
          <span className="text-sm text-gray-500">출제일자:</span>
          <span className="text-sm text-gray-900 ml-1">{date}</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">마감기한: {deadline}</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-sm">
              {dday}
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};
