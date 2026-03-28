/**
 * Utility để build URL đầy đủ cho files
 */

/**
 * Build URL đầy đủ cho avatar/image
 * @param filepath - Đường dẫn file (vd: "1769265390317.jpg")
 * @returns URL đầy đủ hoặc null nếu không có file
 */
export const buildFileUrl = (filepath: string | null): string | null => {
  if (!filepath) return null;

  const port = process.env.PORT || 3000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  return `${baseUrl}/${filepath}`;
};

/**
 * Build URL cho avatar của teacher
 */
export const buildTeacherAvatarUrl = (avatar: string | null): string | null => {
  if (!avatar) return null;
  return buildFileUrl(`uploads/teachers/${avatar}`);
};

/**
 * Build URL cho thumbnail của course
 */
export const buildCourseThumbnailUrl = (
  thumbnail: string | null,
): string | null => {
  if (!thumbnail) return null;
  return buildFileUrl(`uploads/courses/${thumbnail}`);
};

/**
 * Build URL cho file test của course
 */
export const buildCourseTestFileUrl = (
  fileTest: string | null,
): string | null => {
  if (!fileTest) return null;
  return buildFileUrl(`uploads/course-tests/${fileTest}`);
};

/**
 * Build URL cho audio test của course
 */
export const buildCourseTestAudioUrl = (
  audioTest: string | null,
): string | null => {
  if (!audioTest) return null;
  return buildFileUrl(`uploads/course-tests/${audioTest}`);
};

/**
 * Build URL cho audio của Entrance Exam Listening/Reading
 */
export const buildEntranceExamLRAudioUrl = (
  audio: string | null,
): string | null => {
  if (!audio) return null;
  return buildFileUrl(`uploads/entrance-exam-lr/${audio}`);
};

/**
 * Build URL cho image của Entrance Exam Listening/Reading
 */
export const buildEntranceExamLRImageUrl = (
  image: string | null,
): string | null => {
  if (!image) return null;
  return buildFileUrl(`uploads/entrance-exam-lr/${image}`);
}



export const buildWritingImageUrl = (
  filename: string | null,
): string | null => {
  if (!filename) return null;
  return buildFileUrl(`uploads/writing/${filename}`);
};

/**
 * Build URL cho ảnh Speaking Exam (imageThree, imageFour, image)
 */
export const buildSpeakingImageUrl = (
  filename: string | null,
): string | null => {
  if (!filename) return null;
  return buildFileUrl(`uploads/speaking/${filename}`);
};

/**
 * Build URL cho audio answer của Speaking Exam (user upload)
 */
export const buildSpeakingAudioUrl = (
  filename: string | null,
): string | null => {
  if (!filename) return null;
  return buildFileUrl(`uploads/speaking-audio/${filename}`);
};
