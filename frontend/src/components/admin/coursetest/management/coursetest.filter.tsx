import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CoursetestFilterProps {
  search: string;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const CoursetestFilter: React.FC<CoursetestFilterProps> = ({
  search,
  showFilter,
  onSearchChange,
  onToggleFilter,
  onClearFilters,
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggleFilter}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Tìm kiếm</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            showFilter ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showFilter && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm theo tên
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nhập tên bài kiểm tra..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursetestFilter;
