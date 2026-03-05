
/**
 * Coerce multipart/form-data strings to correct types
 * Converts string values to their proper types:
 * - "true"/"false" → boolean
 * - "123" → number
 * 
 * This is necessary because multipart/form-data always sends values as strings
 */
export const coerceRequestBody = (body: any): any => {
  const coerced = { ...body };
  
  // Convert boolean strings
  if (typeof coerced.isActive === 'string') {
    coerced.isActive = coerced.isActive.toLowerCase() === 'true';
  }
  
  // Convert number strings for index
  if (typeof coerced.index === 'string') {
    const num = parseInt(coerced.index, 10);
    if (!isNaN(num)) {
      coerced.index = num;
    }
  }
  
  // Convert other numeric fields if needed
  const numericFields = ['totalQuestion', 'page', 'limit', 'id'];
  numericFields.forEach(field => {
    if (typeof coerced[field] === 'string') {
      const num = parseInt(coerced[field], 10);
      if (!isNaN(num)) {
        coerced[field] = num;
      }
    }
  });
  
  return coerced;
};

/**
 * Extract file paths from multer uploaded files
 * Works with upload.fields() where files are grouped by fieldname
 * 
 * @param files - Multer files object with fieldname keys
 * @returns Object with fieldname -> filename mappings
 */
export const extractFileUrls = (files: { [fieldname: string]: Express.Multer.File[] }): Record<string, string> => {
  const result: Record<string, string> = {};
  
  for (const [fieldname, fileArray] of Object.entries(files)) {
    if (fileArray && fileArray.length > 0) {
      result[fieldname] = fileArray[0].filename;
    }
  }
  
  return result;
};

/**
 * Delete old files from local storage
 * Used when updating parts with new images
 * 
 * @param filePaths - Array of file paths to delete (can include undefined/null)
 */
export const deleteOldFiles = async (filePaths: string[]): Promise<void> => {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  for (const filePath of filePaths) {
    if (!filePath) continue;
    
    try {
      // Construct full path relative to project root
      const fullPath = path.join(process.cwd(), filePath);
      await fs.unlink(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
    } catch (err) {
      // Log but don't throw - cleanup is best-effort
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  }
};

/**
 * Merge request body with file URLs
 * Ensures file URLs override body fields
 * 
 * @param body - Request body (after coercion)
 * @param fileUrls - File URLs extracted from multer
 * @returns Merged object
 */
export const mergeBodyWithFiles = (body: any, fileUrls: Record<string, string>): any => {
  return {
    ...body,
    ...fileUrls, // File URLs take precedence
  };
};

/**
 * Get relative path for file URLs
 * Used to construct correct paths for database storage
 * 
 * @param filename - Filename from multer
 * @param folder - Folder name (e.g., 'writing', 'speaking')
 * @returns Relative path (e.g., 'uploads/writing/1234567890.jpg')
 */
export const getFilePath = (filename: string, folder: string): string => {
  return `uploads/${folder}/${filename}`;
};