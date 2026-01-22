/**
 * Utility để build URL đầy đủ cho files
 */

/**
 * Build URL đầy đủ cho avatar/image
 * @param filename - Tên file (vd: "teacher-1234567890.jpg")
 * @param folder - Thư mục chứa file (vd: "teachers", "courses")
 * @returns URL đầy đủ hoặc null nếu không có file
 */
export const buildFileUrl = (
  filename: string | null,
  folder: string,
): string | null => {
  if (!filename) return null;

  const port = process.env.PORT || 3000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

/**
 * Build URL cho avatar của teacher
 */
export const buildTeacherAvatarUrl = (avatar: string | null): string | null => {
  return buildFileUrl(avatar, "teachers");
};

/**
 * Build URL cho thumbnail của course
 */
export const buildCourseThumbnailUrl = (
  thumbnail: string | null,
): string | null => {
  return buildFileUrl(thumbnail, "courses");
};

/**
 * Build URL cho file test của course
 */
export const buildCourseTestFileUrl = (
  fileTest: string | null,
): string | null => {
  return buildFileUrl(fileTest, "courses");
};
