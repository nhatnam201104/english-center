import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import type { ScheduleResponse } from "../../../types/schedule/schedule.response";
import { getAllSchedules } from "../../../services/schedule.service";
import SchedulePagination from "../../../components/course-detail/schedulePagination";
import ScheduleTable from "../../../components/admin/schedule/scheduleManagement/scheduleTable";


const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const res = await getAllSchedules(page, limit);
        setSchedules(res.data?.data ?? []);
        setTotalItems(res.data?.totalItems ?? 0);
        setTotalPages(res.data?.totalPages ?? 0);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div>
            <Typography variant="h4" color="white" className="font-bold">
              Quản Lý đợt mở lớp học
            </Typography>
            <Typography variant="small" color="white" className="mt-1 opacity-90">
              Tổng số: {totalItems} đợt mở lớp
            </Typography>
          </div>
        </CardHeader>

        <CardBody>
          <ScheduleTable
            schedules={schedules}
            loading={loading}
          />
          <SchedulePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ScheduleManagement;
