import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import type { CourseFormData, Course } from "../types/course";

// Mock Instructor Data (In a real app, this would come from an API call)
const mockInstructors = [
  { id: "1", username: "instructor1", firstName: "John", lastName: "Doe" },
  { id: "2", username: "instructor2", firstName: "Jane", lastName: "Smith" },
  { id: "3", username: "instructor3", firstName: "Robert", lastName: "Brown" },
];

// Zod Schema for Course
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().min(2, "Language is required"),
  category: z.string().min(2, "Category is required"),
  instructorId: z.string().min(1, "Instructor is required"),
});

type CourseFormDataValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void | Promise<void>;
  initialData?: Course | null;
}

export default function CourseForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormDataValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          level: initialData.level,
          language: initialData.language,
          category: initialData.category,
          instructorId: initialData.instructorId,
        }
      : {
          title: "",
          description: "",
          level: "beginner",
          language: "",
          category: "",
          instructorId: "",
        },
  });

  // Reset form when modal opens/closes with new data
  // Note: In a real app, you might manage open/close state outside and pass values
  // For simplicity here, we just reset if no initialData is provided when opening a new form

  const onFormSubmit = (data: CourseFormDataValues) => {
    // onSubmit handler is expected to be async if it involves API calls
    const result = onSubmit(data as CourseFormData);
    if (result instanceof Promise) {
      return result;
    }

    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Course" : "Create New Course"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="e.g., Introduction to Web Development"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Brief description of course content..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Level & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                Level
              </label>
              <select
                id="level"
                {...register("level")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                id="category"
                type="text"
                {...register("category")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="e.g., Web Development"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Language & Instructor Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <select
                id="language"
                {...register("language")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              >
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
                <option value="es">Spanish</option>
              </select>
              {errors.language && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.language.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="instructorId"
                className="block text-sm font-medium text-gray-700"
              >
                Instructor
              </label>
              <select
                id="instructorId"
                {...register("instructorId")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select an instructor...</option>
                {mockInstructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.firstName} {inst.lastName} ({inst.username})
                  </option>
                ))}
              </select>
              {errors.instructorId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instructorId.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              {initialData ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
