import { Card, CardBody, Input } from "@material-tailwind/react";

interface ClassroomFilterProps {
  search: string;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const ClassroomFilter: React.FC<ClassroomFilterProps> = ({
  search,
  showFilter,
  onSearchChange,
  onToggleFilter,
  onClearFilters,
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onToggleFilter}
        className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        {showFilter ? "▼ Ẩn bộ lọc" : "▶ Hiện bộ lọc"}
      </button>

      {showFilter && (
        <Card className="bg-gray-50">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tìm kiếm"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tên lớp học..."
                crossOrigin={undefined}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ClassroomFilter;
