import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { Classroom } from "../../../../types/classroom/response";
import type { GetClassroomRequest } from "../../../../types/classroom/request";
import {
  getAllClassrooms,
  deleteClassroom,
} from "../../../../services/classroom.service";
import ClassroomFilter from "./classroom.filter";
import ClassroomTable from "./classroom.table";
import ClassroomPagination from "./classroom.pagination";

const ClassroomManagement = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");

  const loadClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetClassroomRequest = {
        page: currentPage,
        limit: 10,
      };
      if (search) {
        params.search = search;
      }

      const response = await getAllClassrooms(params);
      setClassrooms(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalItems(response.data?.totalItems || 0);

      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp học:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    loadClassrooms();
  }, [loadClassrooms]);

  const handleEdit = (id: number) => {
    navigate(`/admin/classrooms/update/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp học này không?")) {
      try {
        const response = await deleteClassroom(id);
        if (response.success) {
          alert("Xóa lớp học thành công!");
          loadClassrooms();
        } else {
          alert(response.message || "Xóa lớp học thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa lớp học:", error);
        alert("Xóa lớp học thất bại!");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Quản Lý Lớp Học
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Tổng số: {totalItems} lớp học
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => navigate("/admin/classrooms/create")}
            >
              <PlusIcon className="h-5 w-5" />
              Thêm Lớp Học
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <ClassroomFilter
            search={search}
            showFilter={showFilter}
            onSearchChange={handleSearchChange}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onClearFilters={clearFilters}
          />

          <ClassroomTable
            classrooms={classrooms}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ClassroomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ClassroomManagement;
