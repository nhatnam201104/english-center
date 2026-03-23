import React, { useEffect, useState } from 'react';
import ScheduleCard from './ScheduleCard';
import { getActiveCoursesWithFutureSchedules } from '../../services/course.service';
import type { Course } from '../../types/course/response';

const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getActiveCoursesWithFutureSchedules()
      .then(res => setCourses(res.data ?? []))
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
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <ScheduleCard key={course.id} course={course} />
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Hiện chưa có lịch khai giảng mới. Vui lòng quay lại sau!</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCourses;