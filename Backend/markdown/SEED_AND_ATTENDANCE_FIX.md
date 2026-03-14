# Seed Data & Attendance Check-in Fix

## 📅 Date: March 7, 2026

## 🎯 Task Summary

### 1. Rewrote Seed Data
**Problem:** Seed data didn't match current service logic - missing `TeacherFreeDay` entries and inconsistent schedule patterns.

**Solution:** Completely rewrote seed data to match service validation logic.

### 2. Added Attendance Check-in Endpoint
**Problem:** Frontend was calling `/api/attendance/checkin/1` but backend only had `/api/attendance/scan-qr`.

**Solution:** Added new `/checkin/:sessionId` endpoint for camera/QR scanning functionality.

---

## ✅ Completed Tasks

### 1. Seed Data Rewrite

**File:** `Backend/prisma/Seeder/seed.ts`

**Changes:**
- Created 3 teachers with proper `TeacherFreeDay` entries
- Teacher 1: Free days = TUESDAY, THURSDAY, SATURDAY (2,4,6)
- Teacher 2: Free days = WEDNESDAY, FRIDAY, SUNDAY (3,5,7)
- Teacher 3: No free days (can teach any day)
- Created 3 courses with proper schedules
- Created 3 classrooms with different capacities
- Created 3 schedules matching teacher free days:
  - Schedule 1: 2,4,6 (TUE, THU, SAT 08:00-10:00) - STARTED
  - Schedule 2: 3,5,7 (WED, FRI, SUN 14:00-16:00) - STARTED
  - Schedule 3: 2,4,6 (TUE, THU, SAT 09:00-11:00) - NOT STARTED (30 days)
- Registered student to all courses and schedules

**Validation:**
- ✅ Schedule days match teacher free days (2,4,6 or 3,5,7)
- ✅ No conflicts between schedules
- ✅ Teacher free days properly validated
- ✅ All foreign keys and constraints satisfied

**Test Command:**
```bash
cd Backend && npx tsx prisma/Seeder/seed.ts
```

### 2. Seed API Endpoint

**Files Created:**
- `Backend/src/controllers/seed.controller.ts`
- `Backend/src/routes/seed.routes.ts`

**Route:** `POST /api/seed`

**Purpose:** Run seed data via API for testing

**Test:**
```bash
curl -X POST http://localhost:3000/seed -H "Content-Type: application/json"
```

**Response:** Returns seed data summary including:
- Student credentials
- Parent credentials
- Teacher credentials with free days
- Courses and schedules
- Classrooms
- Password: `Nam@12345`

### 3. Attendance Check-in Fix

**Problem:** 
- Frontend calling: `POST /api/attendance/checkin/:id`
- Backend had: `POST /api/attendance/scan-qr` (different endpoint)
- Result: 404 Not Found

**Solution:** Added new endpoint matching frontend expectations

#### Modified Files:

**Backend/src/controllers/attendance.controller.ts**
- Added `checkIn` function
  - Accepts sessionId from URL params
  - Accepts qrCode from body
  - Reuses existing `scanQRCodeService` logic
  - Validates session ID
  - Returns success/error with proper validation

**Backend/src/routes/attendance.routes.ts**
- Added route: `POST /attendance/checkin/:sessionId`
- Middleware: `authenticate`, `authorize("STUDENT")`
- Controller: `checkIn`

#### New Endpoint Details:

**URL:** `POST /api/attendance/checkin/:sessionId`

**Authentication:** Required (STUDENT role only)

**Request:**
- URL Param: `sessionId` (number)
- Body: `{ qrCode: string }`

**Response:**
```json
{
  "success": true,
  "message": "Điểm danh thành công!",
  "data": {
    "success": true,
    "message": "Điểm danh thành công!",
    "time": "14:30"
  }
}
```

**Error Cases:**
- Session ID invalid: "Session ID không hợp lệ"
- QR invalid: "Mã QR không hợp lệ"
- QR expired: "Mã QR đã hết hạn (quá 30 phút)"
- Not registered: "Bạn chưa đăng ký vào khóa học này"
- Already checked in: "Bạn đã điểm danh rồi"
- Session not found: "Không tìm thấy buổi điểm danh"

---

## 📋 Available Attendance Endpoints

### Student Routes:
1. `POST /api/attendance/scan-qr` - Manual QR input
   - Body: `{ qrCode: "..." }`
   - Use: Student manually enters QR code

2. `POST /api/attendance/checkin/:sessionId` - Camera/QR scanning
   - URL Param: `sessionId`
   - Body: `{ qrCode: "..." }`
   - Use: Camera scans QR code, sends to backend
   - **NEWLY ADDED**

### Teacher Routes:
1. `POST /api/attendance/generate-qr/:sessionId` - Generate QR code
   - URL Param: `sessionId`
   - Use: Teacher generates QR for attendance

2. `GET /api/attendance/history/:sessionId` - View attendance history
   - URL Param: `sessionId`
   - Use: Teacher views who checked in

---

## 🎓 Test Users (from Seed)

### Student
- Email: `student@test.com`
- Password: `Nam@12345`
- Fullname: Nguyễn Văn A
- Phone: `0901234567`

### Parent
- Email: `parent@test.com`
- Password: `Nam@12345`
- Fullname: Nguyễn Thị B
- Phone: `0902345678`

### Teachers

**Teacher 1:**
- Email: `teacher1@test.com`
- Password: `Nam@12345`
- Fullname: Trần Thị C
- Free Days: TUESDAY, THURSDAY, SATURDAY (2,4,6)
- Phone: `09034567890`
- Teaches: TOEIC Level 3 (Schedule 1)

**Teacher 2:**
- Email: `teacher2@test.com`
- Password: `Nam@12345`
- Fullname: Lê Văn D
- Free Days: WEDNESDAY, FRIDAY, SUNDAY (3,5,7)
- Phone: `0904567890`
- Teaches: TOEIC Speaking & Writing (Schedule 2)

**Teacher 3:**
- Email: `teacher3@test.com`
- Password: `Nam@12345`
- Fullname: Phạm Văn E
- Free Days: NONE (can teach any day)
- Phone: `0905678901`
- Teaches: TOEIC Level 4 (Schedule 3, starts in 30 days)

---

## 📚 Test Courses & Schedules

### Course 1: TOEIC Level 3 - General English
- Status: **STARTED**
- Schedule: 2,4,6 (TUE, THU, SAT 08:00-10:00)
- Teacher: Trần Thị C
- Classroom: Phòng 402 - Tòa nhà A (Max: 20)
- Sessions: 60
- Price: 5,000,000 VND (10% off)

### Course 2: TOEIC Speaking & Writing
- Status: **STARTED**
- Schedule: 3,5,7 (WED, FRI, SUN 14:00-16:00)
- Teacher: Lê Văn D
- Classroom: Phòng 503 - Tòa nhà B (Max: 25)
- Sessions: 45
- Price: 6,000,000 VND (5% off)

### Course 3: TOEIC Level 4 - Advanced
- Status: **STARTS IN 30 DAYS**
- Schedule: 2,4,6 (TUE, THU, SAT 09:00-11:00)
- Teacher: Phạm Văn E
- Classroom: Phòng 601 - Tòa nhà C (Max: 15)
- Sessions: 60
- Price: 7,000,000 VND (15% off)

---

## 🧪 Testing Attendance Check-in

### Scenario 1: Teacher Generates QR
```bash
# Login as teacher1@test.com
# Get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher1@test.com","password":"Nam@12345"}'

# Generate QR for session 1
curl -X POST http://localhost:3000/api/attendance/generate-qr/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TEACHER_JWT_TOKEN>"
```

### Scenario 2: Student Checks In (Camera QR Scan)
```bash
# Login as student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Nam@12345"}'

# Check in with QR code (camera scan)
curl -X POST http://localhost:3000/api/attendance/checkin/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_JWT_TOKEN>" \
  -d '{"qrCode":"QR_CODE_FROM_CAMERA"}'
```

### Scenario 3: Manual QR Input
```bash
# Manual QR input (existing endpoint)
curl -X POST http://localhost:3000/api/attendance/scan-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_JWT_TOKEN>" \
  -d '{"qrCode":"QR_CODE_MANUAL"}'
```

---

## 🔑 Key Points

1. **Seed Data Logic:**
   - Teacher free days MUST match schedule days
   - Patterns: 2,4,6 or 3,5,7
   - No free days = can teach any day
   - All validated against service logic

2. **Attendance Check-in:**
   - Both `/scan-qr` and `/checkin/:sessionId` use same service
   - Both validate QR code, expiration, and student registration
   - Idempotent: prevents duplicate check-ins
   - QR expires after 30 minutes

3. **Camera QR Scanning:**
   - Frontend captures QR via camera
   - Sends QR string to `/checkin/:sessionId`
   - Same validation as manual input
   - No backend changes needed for camera functionality

---

## 📝 Next Steps

1. **Test Attendance Flow:**
   - Start backend server
   - Login as teacher, generate QR
   - Login as student, check in via both endpoints
   - Verify attendance records

2. **Camera Integration:**
   - Test frontend camera QR scanning
   - Verify QR code string format
   - Test error handling (expired QR, invalid QR)

3. **Additional Features:**
   - Add attendance scoring/grading
   - Add notification system for late check-ins
   - Add export attendance reports

---

## ✅ Verification Checklist

- [x] Seed data rewritten with proper teacher free days
- [x] Seed data tested successfully
- [x] Seed API endpoint created
- [x] Check-in controller function added
- [x] `/checkin/:sessionId` route added
- [x] Route properly authenticated (STUDENT role)
- [x] Uses existing validation logic
- [x] Compatible with camera QR scanning
- [ ] Backend server started and tested
- [ ] Attendance flow tested end-to-end
- [ ] Camera QR scanning verified

---

## 📞 Support

If you encounter any issues:
1. Check database connection in `.env`
2. Verify seed data in `prisma/Seeder/seed.ts`
3. Check route configuration in `src/routes/route.ts`
4. Review service logic in `src/services/attendance.service.ts`