import { Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ParentFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const ParentFilter = ({ search, onSearchChange }: ParentFilterProps) => {
  return (
    <div className="mb-6">
      <Input
        label="Tìm kiếm theo tên, email, số điện thoại"
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        crossOrigin={undefined}
      />
    </div>
  );
};

export default ParentFilter;
