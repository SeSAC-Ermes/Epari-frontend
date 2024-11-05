export const AssignmentHeader = ({date, title, deadline}) => (
    <>
      <div className="mb-4 text-sm text-gray-500">
        출제 일자: {date}
      </div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-sm">
        마감기한 {deadline}
      </span>
      </div>
    </>
);
