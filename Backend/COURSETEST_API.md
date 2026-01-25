# CourseTest API Documentation

## Overview

Complete CRUD API for CourseTest with file/audio storage support.

## Features

- ✅ Create CourseTest with file upload (audio/documents)
- ✅ Optional audio field for CourseTest
- ✅ Read/List CourseTests with filtering and pagination
- ✅ Update CourseTest metadata
- ✅ Update CourseTest file separately
- ✅ Update CourseTest audio separately
- ✅ Delete CourseTest (with file, audio and related scores cleanup)
- ✅ Support for audio files (mp3, wav, ogg, m4a)
- ✅ Support for documents (pdf, doc, docx, txt)
- ✅ File size limit: 50MB
- ✅ Automatic file cleanup on delete/update

## File Structure

### DTOs

- `src/DTOS/CourseTest/create-coursetest.request.ts` - Create request
- `src/DTOS/CourseTest/update-coursetest.request.ts` - Update request
- `src/DTOS/CourseTest/get-coursetest.request.ts` - Get/List request
- `src/DTOS/CourseTest/coursetest.response.ts` - Response

### Service

- `src/services/courseTest.service.ts` - Business logic with file handling

### Controller

- `src/controllers/coursetest.controller.ts` - Request handlers

### Routes

- `src/routes/coursetest.routes.ts` - API endpoints

### Validator

- `src/validators/coursetest.validator.ts` - Request validation

### Mapper

- `src/utils/Mapper/coursetest.mapper.ts` - Entity to DTO mapping

## API Endpoints

### 1. Create CourseTest

```http
POST /api/course-tests
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
{
  "courseId": 1,
  "name": "IELTS Listening Test 1",
  "index": 1
}

Files:
- fileTest (required) - Audio or document file
- audioTest (optional) - Audio file for listening materials
```

### 2. Get All CourseTests

```http
GET /api/course-tests?page=1&limit=10&search=ielts&courseId=1&sortBy=index&sortOrder=asc
Authorization: Bearer {token}
```

Query Parameters:

- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search in name
- `courseId` (optional): Filter by course ID
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): asc or desc (default: desc)

### 3. Get CourseTest by ID

```http
GET /api/course-tests/:id
Authorization: Bearer {token}
```

### 5. Update CourseTest (Metadata)

```http
PUT /api/course-tests/:id
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "courseId": 2,
  "name": "Updated Test Name",
  "index": 2
}
```

### 6. Update CourseTest File

```http
PATCH /api/course-tests/:id/file
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: fileTest (required) - New audio or document file
```

### 7. Update CourseTest Audio

```http
PATCH /api/course-tests/:id/audio
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: audioTest (required) - Audio file for listening materials
```

### 8. Delete CourseTest

```http
DELETE /api/course-tests/:id
Authorization: Bearer {token}
```

## Supported File Types

### Audio Files

- .mp3
- .wav
- .ogg
- .m4a

### Documents

- .pdf
- .doc
- .docx
- .txt

## File Storage

- Files are stored in: `uploads/course-tests/`
- File naming: `course-tests-{timestamp}.{extension}`
- Database stores: Full path (e.g., `uploads/course-tests/course-tests-1700000000000.pdf`)
- Response returns: Full URL with base URL (e.g., `http://localhost:8081/uploads/course-tests/course-tests-1700000000000.pdf`)
- Old files are automatically deleted when:
  - Updating a CourseTest file
  - Updating a CourseTest audio
  - Deleting a CourseTest

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "courseId": 1,
    "name": "IELTS Listening Test 1",
    "index": 1,
    "fileTest": "http://localhost:3000/uploads/course-tests/course-tests-1700000000000.pdf",
    "audioTest": "http://localhost:3000/uploads/course-tests/course-tests-1700000000001.mp3",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** File paths are automatically converted to full URLs using the backend's base URL (configurable via `BASE_URL` environment variable).

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [...],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

## Access Control

| Role    | Create | Read | Update Metadata | Update File/Audio | Delete |
| ------- | ------ | ---- | --------------- | ----------------- | ------ |
| Admin   | ✅     | ✅   | ✅              | ✅                | ✅     |
| Teacher | ❌     | ✅   | ❌              | ❌                | ❌     |
| Student | ❌     | ✅   | ❌              | ❌                | ❌     |

## Business Rules

1. **Unique Name**: CourseTest name must be unique within a course
2. **Required Fields**:
   - `courseId` - Must exist
   - `name` - Required, 2-200 characters
   - `index` - Required, positive integer
   - `fileTest` - Required on create and file update
   - `audioTest` - Optional, for audio listening materials
3. **File Cleanup**: Automatically deletes related files and scores on delete
4. **Cascading Delete**: Deleting a course will delete all related course tests

## Example Usage

### Create a new CourseTest with file and optional audio

```bash
curl -X POST http://localhost:3000/api/course-tests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "courseId=1" \
  -F "name=IELTS Listening Test 1" \
  -F "index=1" \
  -F "fileTest=@/path/to/document.pdf" \
  -F "audioTest=@/path/to/audio.mp3"
```

### Update CourseTest file

```bash
curl -X PATCH http://localhost:3000/api/course-tests/1/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fileTest=@/path/to/new-audio.mp3"
```

### Update CourseTest audio

```bash
curl -X PATCH http://localhost:3000/api/course-tests/1/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fileTest=@/path/to/new-audio.mp3"
```

```bash
curl -X PATCH http://localhost:3000/api/course-tests/1/audio \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "audioTest=@/path/to/new-audio.wav"
```

### Get CourseTests for a specific course

```bash
curl -X GET "http://localhost:3000/api/course-tests?courseId=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error if available"
}
```

Common error codes:

- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Internal server error
