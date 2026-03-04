import { Button, Typography } from "@material-tailwind/react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => (
  <div className="flex items-center justify-center gap-4 mt-4">
    <Button
      variant="text"
      size="sm"
      disabled={page <= 1}
      onClick={() => onChange(page - 1)}
    >
      Trước
    </Button>
    <Typography variant="small" className="text-gray-600">
      Trang {page} / {totalPages}
    </Typography>
    <Button
      variant="text"
      size="sm"
      disabled={page >= totalPages}
      onClick={() => onChange(page + 1)}
    >
      Sau
    </Button>
  </div>
);

export default Pagination;
