import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return {
    bg: `hsl(${h}, 70%, 60%)`,
    border: `hsl(${h}, 70%, 50%)`
  };
};

/**
 * 커리큘럼 캘린더 컴포넌트
 */
const CurriculumCalendar = ({ events }) => {
  // 시작일과 종료일 계산
  const dateRange = useMemo(() => {
    if (!events.length) return { start: null, end: null };

    const dates = events.map(event => new Date(event.date));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));

    // 시작일은 해당 월의 1일로
    startDate.setDate(1);
    // 종료일은 다음 월의 1일로 (이번 달 마지막 날까지 보이도록)
    endDate.setMonth(endDate.getMonth(), 1);

    return {
      start: startDate,
      end: endDate
    };
  }, [events]);

  const calendarEvents = useMemo(() => {
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dateOrderMap = new Map();
    sortedEvents.forEach((event, index) => {
      dateOrderMap.set(event.date, index + 1);
    });

    const uniqueTopics = new Set(events.map(event =>
        event.topic.split('(')[0].trim()
    ));
    const topicColors = new Map();
    uniqueTopics.forEach(topic => {
      topicColors.set(topic, stringToColor(topic));
    });

    return events.map(event => {
      const mainTopic = event.topic.split('(')[0].trim();
      const colors = topicColors.get(mainTopic);

      return {
        title: event.topic,
        date: event.date,
        extendedProps: {
          description: event.description,
          order: dateOrderMap.get(event.date),
          mainTopic
        },
        backgroundColor: colors.bg,
        borderColor: colors.border
      };
    });
  }, [events]);

  if (!dateRange.start || !dateRange.end) {
    return <div>No events to display</div>;
  }

  return (
      <div className="rounded-lg shadow-lg bg-white p-4">
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            locale="ko"
            height="auto"
            fixedWeekCount={false}
            validRange={{
              start: dateRange.start,
              end: dateRange.end
            }}
            eventContent={(eventInfo) => (
                <div className="p-1 text-xs">
                  <div className="font-bold">{`${eventInfo.event.extendedProps.order}일차`}</div>
                  <div className="truncate">{eventInfo.event.title}</div>
                </div>
            )}
            eventClick={(info) => {
              alert(
                  `강의 정보:\n\n${info.event.extendedProps.order}일차\n${info.event.title}\n\n${info.event.extendedProps.description}`
              );
            }}
        />
      </div>
  );
};

export default CurriculumCalendar;
