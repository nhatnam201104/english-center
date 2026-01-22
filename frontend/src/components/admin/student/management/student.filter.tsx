import { Input, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface StudentFilterProps {
  search: string;
  minScoreRl: string;
  maxScoreRl: string;
  minScoreSw: string;
  maxScoreSw: string;
  showFilter: boolean;
  onSearchChange: (value: string) => void;
  onMinScoreRlChange: (value: string) => void;
  onMaxScoreRlChange: (value: string) => void;
  onMinScoreSwChange: (value: string) => void;
  onMaxScoreSwChange: (value: string) => void;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

const StudentFilter = ({
  search,
  minScoreRl,
  maxScoreRl,
  minScoreSw,
  maxScoreSw,
  showFilter,
  onSearchChange,
  onMinScoreRlChange,
  onMaxScoreRlChange,
  onMinScoreSwChange,
  onMaxScoreSwChange,
  onToggleFilter,
  onClearFilters,
}: StudentFilterProps) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            label="Điểm RL tối thiểu"
            type="number"
            value={minScoreRl}
            onChange={(e) => onMinScoreRlChange(e.target.value)}
            crossOrigin={undefined}
          />
          <Input
            label="Điểm RL tối đa"
            type="number"
            value={maxScoreRl}
            onChange={(e) => onMaxScoreRlChange(e.target.value)}
            crossOrigin={undefined}
          />
          <Input
            label="Điểm SW tối thiểu"
            type="number"
            value={minScoreSw}
            onChange={(e) => onMinScoreSwChange(e.target.value)}
            crossOrigin={undefined}
          />
          <Input
            label="Điểm SW tối đa"
            type="number"
            value={maxScoreSw}
            onChange={(e) => onMaxScoreSwChange(e.target.value)}
            crossOrigin={undefined}
          />
          <Button variant="outlined" onClick={onClearFilters}>
            Xóa Bộ Lọc
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentFilter;
