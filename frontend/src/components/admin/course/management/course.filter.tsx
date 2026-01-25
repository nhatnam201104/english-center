import {
  Card,
  CardBody,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

interface CourseFilterProps {
  search: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({
  search,
  type,
  minPrice,
  maxPrice,
  showFilter,
  onSearchChange,
  onTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Tìm kiếm"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tên khóa học..."
                crossOrigin={undefined}
              />

              <Select
                label="Loại khóa học"
                value={type}
                onChange={(value) => onTypeChange(value || "")}
              >
                <Option value="">Tất cả</Option>
                <Option value="COURSE">Khóa học</Option>
                <Option value="TEST_PREPARATION">Luyện thi</Option>
              </Select>

              <Input
                label="Giá tối thiểu"
                type="number"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                placeholder="0"
                crossOrigin={undefined}
              />

              <Input
                label="Giá tối đa"
                type="number"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                placeholder="0"
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

export default CourseFilter;
