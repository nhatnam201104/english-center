import { CreditCard, Calendar, Users, DoorOpen, BookOpen } from "lucide-react";
import type { ScheduleResponse } from "../../../../types/schedule/schedule.response";
import StatCard from "./statCard";

const TopStats = ({ schedule }: { schedule: ScheduleResponse }) => {
  const price = schedule.course.price - (schedule.course.price*schedule.course.sale/100)
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard
        icon={<CreditCard size={20} />}
        label="GIÁ"
        value={
          schedule.course?.price
            ? `${price.toLocaleString("vi-VN")} ₫`
            : ""
        }
        color="text-blue-600"
      />

      <StatCard
        icon={<Calendar size={20} />}
        label="THỜI GIAN"
        value={
          schedule.startTime && schedule.endTime
            ? `${new Date(schedule.startTime).toLocaleDateString(
                "vi-VN"
              )} – ${new Date(schedule.endTime).toLocaleDateString("vi-VN")}`
            : ""
        }
        color="text-blue-600"
      />

      <StatCard
        icon={<Users size={20} />}
        label="SĨ SỐ"
        value={`${schedule.totalRegister ?? 0} / ${schedule.totalSlot ?? ""}`}
        color="text-blue-600"
      />

      <StatCard
        icon={<BookOpen size={20} />}
        label="SỐ BUỔI"
        value={`${schedule.course?.totalSession ?? 0}`}
        color="text-blue-600"
      />

      <StatCard
        icon={<DoorOpen size={20} />}
        label="PHÒNG"
        value={schedule.classroom?.name || "N/A"}
        color="text-blue-600"
      />
    </div>
  );
};

export default TopStats;
