interface TeacherCoursesFilterProps {
  status: string;
  scheduleType: string;
  showFilter: boolean;
  onStatusChange: (value: string) => void;
  onScheduleTypeChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const TeacherCoursesFilter: React.FC<TeacherCoursesFilterProps> = ({
  status,
  scheduleType,
  showFilter,
  onStatusChange,
  onScheduleTypeChange,
  onToggleFilter,
  onClearFilters,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onToggleFilter}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </button>

        {(status || scheduleType) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {showFilter && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="UPCOMING">Sắp diễn ra</option>
              <option value="ONGOING">Đang diễn ra</option>
              <option value="FINISHED">Đã kết thúc</option>
            </select>
          </div>

          {/* Schedule type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lịch học
            </label>
            <select
              value={scheduleType}
              onChange={(e) => onScheduleTypeChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="246">Thứ 2 - 4 - 6</option>
              <option value="357">Thứ 3 - 5 - 7</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesFilter;
