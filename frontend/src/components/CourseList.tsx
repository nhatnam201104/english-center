import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import type { Course } from "../types/course";
import { courseService } from "../services/course.service";

interface CourseListProps {
  onEdit?: (course: Course) => void;
}

export default function CourseList({ onEdit }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await courseService.getAll();
        setCourses(data);
      } catch (error) {
        toast.error("Failed to load courses");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Handler functions
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await courseService.delete(id);
      setCourses(courses.filter((c) => c.id !== id));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Controls */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 min-w-0 max-w-lg">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search courses..."
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                <option value="all">All Categories</option>
                <option value="Web Dev">Web Development</option>
                <option value="Design">Design</option>
                <option value="Data">Data Science</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Instructor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lessons
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {course.instructor?.username
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {course.instructor?.firstName}{" "}
                              {course.instructor?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{course.instructor?.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            course.level === "beginner"
                              ? "bg-green-100 text-green-800"
                              : course.level === "intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {course.totalLessons}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(course)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(course.id, course.title)
                            }
                            disabled={deletingId === course.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
