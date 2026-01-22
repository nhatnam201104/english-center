import { Input, Button, Select, Option } from "@material-tailwind/react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface TeacherFilterProps {
  search: string;
  degree: string;
  isTeaching: string;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onDegreeChange: (value: string) => void;
  onIsTeachingChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const TeacherFilter = ({
  search,
  degree,
  isTeaching,
  showFilter,
  onSearchChange,
  onDegreeChange,
  onIsTeachingChange,
  onToggleFilter,
  onClearFilters,
}: TeacherFilterProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            label="Tìm kiếm theo tên, email, số điện thoại"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            crossOrigin={undefined}
          />
        </div>
        <Button
          variant={showFilter ? "filled" : "outlined"}
          className="flex items-center gap-2"
          onClick={onToggleFilter}
        >
          <FunnelIcon className="h-5 w-5" />
          Lọc
        </Button>
      </div>

      {showFilter && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <Select
            label="Bằng cấp"
            value={degree}
            onChange={(val) => onDegreeChange(val || "")}
          >
            <Option value="">Tất cả</Option>
            <Option value="Cử nhân">Cử nhân</Option>
            <Option value="Thạc sĩ">Thạc sĩ</Option>
            <Option value="Tiến sĩ">Tiến sĩ</Option>
          </Select>

          <Select
            label="Trạng thái giảng dạy"
            value={isTeaching}
            onChange={(val) => onIsTeachingChange(val || "")}
          >
            <Option value="">Tất cả</Option>
            <Option value="true">Đang giảng dạy</Option>
            <Option value="false">Không giảng dạy</Option>
          </Select>

          <Button variant="outlined" onClick={onClearFilters}>
            Xóa Bộ Lọc
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeacherFilter;
