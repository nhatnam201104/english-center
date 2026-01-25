import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import type { Course, CourseFormData } from "../types/course";
import { courseService } from "../services/course.service";

/**
 * Page for managing Courses (CRUD).
 * Handles state for the modal and delegates fetching to CourseList.
 */
export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.id, data);
      } else {
        await courseService.create(data);
      }
      // Refresh is handled by CourseList's internal effect,
      // or we could manually trigger a refresh logic here.
      // For now, CourseList handles its own data fetching.
      // If we wanted to optimize, we could use a shared store.

      handleCloseModal();
    } catch (error) {
      console.error("Form submission failed", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header for this page */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create New Course
            </button>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="py-6">
        <CourseList onEdit={handleOpenEditModal} />
      </div>

      {/* Modal Form */}
      <CourseForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingCourse}
      />
    </div>
  );
}
