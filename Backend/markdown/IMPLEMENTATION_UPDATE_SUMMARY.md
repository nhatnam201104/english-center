# Implementation Summary: Speaking & Writing API Improvements

## ✅ Completed Tasks

### 1. Prisma Schema Updates
- Added unique constraints to 8 exam part tables:
  - `writing_one_to_five`: `(writingExamId, index)`
  - `writing_six_seven`: `(writingExamId, index)`
  - `writing_eight`: `(writingExamId, index)`
  - `speaking_one_two`: `(speakingExamId, index)`
  - `speaking_three_four`: `(speakingExamId, index)`
  - `speaking_five_to_seven`: `(speakingExamId, index)`
  - `speaking_eight_to_ten`: `(speakingExamId, index)`
  - `speaking_eleven`: `(speakingExamId, index)`

### 2. Migration Created & Deployed
- **File**: `Backend/prisma/migrations/20260304065010_add_unique_constraints/migration.sql`
- **Status**: ✅ Successfully deployed
- **SQL**: Adds 8 unique indexes to enable `upsert()` operations

### 3. Data Coercion Utilities
- **File**: `Backend/src/utils/dataCoercion.ts` (NEW)
- **Functions**:
  - `coerceRequestBody()`: Convert multipart/form-data strings to proper types
  - `extractFileUrls()`: Extract file paths from multer uploads
  - `deleteOldFiles()`: Cleanup old image files on updates
  - `mergeBodyWithFiles()`: Merge body data with file URLs
  - `getFilePath()`: Construct relative file paths

### 4. Zod Validator Updates

#### Writing Validators
- **File**: `Backend/src/validators/writing.zod.ts` (UPDATED)
  - Added `.coerce.boolean()` for `isActive` fields
  - Added `.coerce.number()` for `index`, `id` parameters
  - Simplified parameter schemas

#### Speaking Validators
- **File**: `Backend/src/validators/speaking.zod.ts` (NEW)
  - Created complete validators for all 5 Speaking parts
  - Part 1: `SpeakingOneTwo` (2 questions)
  - Part 2: `SpeakingThreeFour` (2 images)
  - Part 3: `SpeakingFiveToSeven` (3 questions + passage)
  - Part 4: `SpeakingEightToTen` (3 questions + passage + optional image)
  - Part 5: `SpeakingEleven` (1 opinion question)

- **File**: `Backend/src/validators/speaking.validator.ts` (NEW)
  - Middleware wrappers for all Speaking validators
  - Validates both create and update schemas based on HTTP method

### 5. Writing Service Refactor
- **File**: `Backend/src/services/writing.service.ts` (UPDATED)
- **New Methods**:
  - `upsertPart1Service()`: Unified create/update for Part 1 with file cleanup
  - `upsertPart2Service()`: Unified create/update for Part 2 with file cleanup
  - `upsertPart3Service()`: Unified create/update for Part 3 (no files)
- **Enhanced Methods**:
  - `deletePart1Service()`: Added file cleanup for 5 images
  - `deletePart2Service()`: Added file cleanup for 2 images

### 6. Writing Controller Updates
- **File**: `Backend/src/controllers/writing.controller.ts` (UPDATED)
- **Changes**:
  - Imported coercion utilities
  - Updated all upsert methods to use `upsertPartXService`
  - Added data coercion logic (`coerceRequestBody()`)
  - Added file extraction and merging (`extractFileUrls()`, `mergeBodyWithFiles()`)

### 7. Writing Routes Updates
- **File**: `Backend/src/routes/writing.routes.ts` (UPDATED)
- **Changes**:
  - Removed separate POST endpoints for create
  - Consolidated to PUT /:id/partX/:index for upsert operations
  - Removed manual filename attachment middleware
  - Cleaner, more RESTful API design

### 8. Speaking Service Implementation
- **File**: `Backend/src/services/speaking.service.ts` (NEW - 400+ lines)
- **Methods Implemented**:
  - **Main Exam**: `create`, `getAll`, `getById`, `update`, `toggleActive`, `delete`
  - **Part 1** (Read a Text Aloud): `upsert`, `get`, `delete`
  - **Part 2** (Describe a Picture): `upsert`, `get`, `delete` (with file cleanup)
  - **Part 3** (Respond to Questions): `upsert`, `get`, `delete`
  - **Part 4** (Respond to Questions using Information Provided): `upsert`, `get`, `delete` (with file cleanup)
  - **Part 5** (Express an Opinion): `upsert`, `get`, `delete`
- **Features**:
  - All upsert methods use `prisma.upsert()` with unique constraints
  - File cleanup on updates/deletes for Parts 2 and 4
  - Transaction-safe exam deletion (deletes all related parts)

### 9. Speaking Controller Implementation
- **File**: `Backend/src/controllers/speaking.controller.ts` (NEW)
- **Methods Implemented**:
  - All 5 parts with full CRUD operations
  - Data coercion for all endpoints
  - File handling for Parts 2 and 4
  - Contextual success messages (indicates if images were updated)

### 10. Speaking Routes Implementation
- **File**: `Backend/src/routes/speaking.routes.ts` (NEW)
- **Routes Implemented**:
  - **Main Exam**: POST /, GET /, GET /:id, PUT /:id, PATCH /:id/toggle-active, DELETE /:id
  - **Part 1**: GET /:id/part1, PUT /:id/part1/:index, DELETE /:id/part1/:index
  - **Part 2**: GET /:id/part2, PUT /:id/part2/:index, DELETE /:id/part2/:index
  - **Part 3**: GET /:id/part3, PUT /:id/part3/:index, DELETE /:id/part3/:index
  - **Part 4**: GET /:id/part4, PUT /:id/part4/:index, DELETE /:id/part4/:index
  - **Part 5**: GET /:id/part5, PUT /:id/part5/:index, DELETE /:id/part5/:index

### 11. Prisma Client Regenerated
- ✅ `npx prisma generate` completed successfully
- All unique constraints now available in generated client

## 🎯 Key Improvements

### Data Coercion
- **Before**: Manual type conversion in controllers
- **After**: Automatic via Zod `.coerce()` + utility functions
- **Benefit**: Less code, fewer bugs, consistent behavior

### Upsert Operations
- **Before**: Separate `create` and `update` methods
- **After**: Single `upsert` method using `prisma.upsert()`
- **Benefit**: DRY principle, cleaner code, automatic duplicate prevention

### File Cleanup
- **Before**: Old images accumulated on filesystem
- **After**: Automatic deletion on updates/deletes
- **Benefit**: Saves disk space, prevents garbage files

### Unique Constraints
- **Before**: Manual duplicate checks in application code
- **After**: Database-enforced uniqueness via unique indexes
- **Benefit**: Data integrity, prevents race conditions, simpler code

### RESTful API Design
- **Before**: POST /:id/part1 (create), PUT /:id/part1/:index (update)
- **After**: Single PUT /:id/part1/:index (upsert) for both create and update
- **Benefit**: Simpler API, fewer endpoints, easier to understand

## 📁 Files Created (7)

1. `Backend/prisma/migrations/20260304065010_add_unique_constraints/migration.sql`
2. `Backend/src/utils/dataCoercion.ts`
3. `Backend/src/validators/speaking.zod.ts`
4. `Backend/src/validators/speaking.validator.ts`
5. `Backend/src/services/speaking.service.ts`
6. `Backend/src/controllers/speaking.controller.ts`
7. `Backend/src/routes/speaking.routes.ts`

## 📁 Files Updated (4)

1. `Backend/prisma/schema.prisma` - Added unique constraints
2. `Backend/src/validators/writing.zod.ts` - Added .coerce() methods
3. `Backend/src/services/writing.service.ts` - Added upsert methods
4. `Backend/src/controllers/writing.controller.ts` - Added coercion logic
5. `Backend/src/routes/writing.routes.ts` - Consolidated to upsert endpoints

## ⚠️ Important Notes

### Migration Safety
- ✅ Migration creates unique indexes
- ⚠️ If duplicate `(examId, index)` combinations exist, migration will fail
- 💡 Need to clean up duplicates before running migration in production

### File Storage
- Files stored in `uploads/writing/` and `uploads/speaking/`
- Full path format: `uploads/{type}/{timestamp}_{fieldname}.jpg`
- Cleanup uses `process.cwd()` to resolve absolute paths
- Automatic deletion on updates (if new file provided) and deletes

### Backward Compatibility
- ✅ Routes remain backward compatible (GET endpoints unchanged)
- ⚠️ Writing routes changed from POST to PUT for create/update
- 💡 Frontend needs to update to use PUT for create operations

### Validation
- All validators use Zod with `.coerce()` for automatic type conversion
- Speaking validators switch between create/update schemas based on HTTP method
- Validation errors return detailed issue arrays for debugging

## 🚀 Next Steps

1. [ ] Register new routes in main route file (`Backend/src/routes/route.ts`)
2. [ ] Update frontend to use new upsert endpoints (PUT instead of POST)
3. [ ] Run integration tests to verify all endpoints work correctly
4. [ ] Verify file cleanup works correctly in development
5. [ ] Check database for existing duplicate records before production deployment
6. [ ] Update API documentation to reflect new endpoint structure

## 📊 API Endpoint Summary

### Writing Endpoints
```
POST   /api/writing                    - Create exam
GET    /api/writing                    - List exams (paginated)
GET    /api/writing/:id                - Get exam with all parts
PUT    /api/writing/:id                - Update exam
PATCH  /api/writing/:id/toggle-active  - Toggle active status
DELETE /api/writing/:id                - Delete exam

PUT    /api/writing/:id/part1/:index   - Upsert Part 1 (with files)
GET    /api/writing/:id/part1         - Get all Part 1
DELETE /api/writing/:id/part1/:index   - Delete Part 1

PUT    /api/writing/:id/part2/:index   - Upsert Part 2 (with files)
GET    /api/writing/:id/part2         - Get all Part 2
DELETE /api/writing/:id/part2/:index   - Delete Part 2

PUT    /api/writing/:id/part3/:index   - Upsert Part 3
GET    /api/writing/:id/part3         - Get all Part 3
DELETE /api/writing/:id/part3/:index   - Delete Part 3
```

### Speaking Endpoints
```
POST   /api/speaking                   - Create exam
GET    /api/speaking                   - List exams (paginated)
GET    /api/speaking/:id               - Get exam with all parts
PUT    /api/speaking/:id               - Update exam
PATCH  /api/speaking/:id/toggle-active - Toggle active status
DELETE /api/speaking/:id               - Delete exam

PUT    /api/speaking/:id/part1/:index  - Upsert Part 1
GET    /api/speaking/:id/part1        - Get all Part 1
DELETE /api/speaking/:id/part1/:index  - Delete Part 1

PUT    /api/speaking/:id/part2/:index  - Upsert Part 2 (with files)
GET    /api/speaking/:id/part2        - Get all Part 2
DELETE /api/speaking/:id/part2/:index  - Delete Part 2

PUT    /api/speaking/:id/part3/:index  - Upsert Part 3
GET    /api/speaking/:id/part3        - Get all Part 3
DELETE /api/speaking/:id/part3/:index  - Delete Part 3

PUT    /api/speaking/:id/part4/:index  - Upsert Part 4 (with files)
GET    /api/speaking/:id/part4        - Get all Part 4
DELETE /api/speaking/:id/part4/:index  - Delete Part 4

PUT    /api/speaking/:id/part5/:index  - Upsert Part 5
GET    /api/speaking/:id/part5        - Get all Part 5
DELETE /api/speaking/:id/part5/:index  - Delete Part 5