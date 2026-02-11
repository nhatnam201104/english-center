import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ScheduleResponse } from '../../types/schedule/schedule.response';
import { getUpcomingSchedules } from '../../services/schedule.service';
import ScheduleCard from './scheduleCard';



const FeaturedCourses: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  useEffect(() => {
    getUpcomingSchedules()
      .then(res => setSchedules(res.data ?? []))
      .catch(err => console.error("API ERROR:", err));
  }, []);

  return (
    <section className="py-24 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Khóa học TOEIC <span className="text-blue-600">tiêu biểu</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Cam kết đầu ra bằng văn bản. Lộ trình cá nhân hóa giúp bạn chinh phục mục tiêu nhanh nhất.
            </p>
          </div>

          <a
            href="#"
            className="group flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-all"
          >
            Tất cả khóa học
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Hiện chưa có lịch khai giảng mới. Vui lòng quay lại sau!</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCourses;