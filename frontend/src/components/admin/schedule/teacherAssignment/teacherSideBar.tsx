import { Search } from "lucide-react";
import TeacherCard from "./teacherCard";

const TeacherSidebar = ({ teachers, onDragStart }: any) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Teacher Directory</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm"
        />
      </div>

      <div className="space-y-4">
        {teachers.map((teacher: any, idx: number) => (
          <TeacherCard
            key={idx}
            teacher={teacher}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </aside>
  );
};

export default TeacherSidebar;