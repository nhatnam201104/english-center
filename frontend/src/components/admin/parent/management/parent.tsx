import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { ParentResponse } from "../../../../types/parent/response";
import type { GetParentRequest } from "../../../../types/parent/request";
import {
  getAllParentsService,
  deleteParentService,
} from "../../../../services/parent.service";
import { useDebounce } from "../../../../helpers/useDebounce";
import ParentFilter from "./parent.filter";
import ParentTable from "./parent.table";
import ParentPagination from "./parent.pagination";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const loadParents = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetParentRequest = {
        page: currentPage,
        limit: 10,
        includeStudents: true,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await getAllParentsService(params);
      if (response.success && response.data) {
        setParents(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi tải danh sách phụ huynh:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    loadParents();
  }, [loadParents]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phụ huynh này?")) {
      try {
        const response = await deleteParentService(id);
        if (response.success) {
          alert("Xóa phụ huynh thành công!");
          loadParents();
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        alert(apiError.response?.data?.message || "Xóa phụ huynh thất bại!");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-purple-600 to-purple-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Quản Lý Phụ Huynh
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Tổng số: {totalItems} phụ huynh
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-50"
              onClick={() => navigate("/admin/parents/create")}
            >
              <PlusIcon className="h-5 w-5" />
              Thêm Phụ Huynh
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <ParentFilter
            search={search}
            onSearchChange={handleSearchChange}
          />

          <ParentTable
            parents={parents}
            loading={loading}
            onDelete={handleDelete}
            onLinkedSuccess={loadParents}
          />

          <ParentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ParentManagement;
