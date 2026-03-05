# API Documentation - TOEIC Entrance Exam

## Overview
This API provides CRUD operations for TOEIC Speaking and Writing entrance exams with full support for managing all exam parts and image uploads.

## Authentication & Authorization
All endpoints require JWT authentication. Some endpoints have role-based access control:
- **ADMIN**: Full access (create, update, delete)
- **TEACHER/STUDENT**: Read-only access

---

## Speaking Exam API

### Base URL: `/api/speaking`

### Main Exam Endpoints

#### 1. Create Speaking Exam
```http
POST /api/speaking
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "TOEIC Speaking Test 1",
  "isActive": true
}
```

#### 2. Get All Speaking Exams
```http
GET /api/speaking?page=1&limit=10&search=test
Authorization: Bearer <token>
```

#### 3. Get Speaking Exam by ID (with all parts)
```http
GET /api/speaking/:id
Authorization: Bearer <token>
```

#### 4. Update Speaking Exam
```http
PUT /api/speaking/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Test Name",
  "isActive": false
}
```

#### 5. Toggle Active Status
```http
PATCH /api/speaking/:id/toggle-active
Authorization: Bearer <token>
```

#### 6. Delete Speaking Exam
```http
DELETE /api/speaking/:id
Authorization: Bearer <token>
```

---

### Part 1: Read a Text Aloud (Câu 1-2)

#### Create Part 1
```http
POST /api/speaking/:id/part1
Authorization: Bearer <token>
Content-Type: application/json

{
  "index": 1,
  "questionOne": "Read this text aloud...",
  "questionTwo": "Read this text aloud..."
}
```

#### Get Part 1
```http
GET /api/speaking/:id/part1
Authorization: Bearer <token>
```

#### Update Part 1
```http
PUT /api/speaking/:id/part1/:index
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionOne": "Updated text...",
  "questionTwo": "Updated text..."
}
```

#### Delete Part 1
```http
DELETE /api/speaking/:id/part1/:index
Authorization: Bearer <token>
```

---

### Part 2: Describe a Picture (Câu 3-4)

#### Create Part 2
```http
POST /api/speaking/:id/part2
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- index: 1 (number)
- imageThree: [image file]
- imageFour: [image file]
```

#### Get Part 2
```http
GET /api/speaking/:id/part2
Authorization: Bearer <token>
```

#### Update Part 2
```http
PUT /api/speaking/:id/part2/:index
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- imageThree: [image file] (optional)
- imageFour: [image file] (optional)
```

#### Delete Part 2
```http
DELETE /api/speaking/:id/part2/:index
Authorization: Bearer <token>
```

---

### Part 3: Respond to Questions (Câu 5-7)

#### Create Part 3
```http
POST /api/speaking/:id/part3
Authorization: Bearer <token>
Content-Type: application/json

{
  "index": 1,
  "passage": "Scenario description...",
  "questionFive": "What would you do?",
  "questionSix": "How would you handle this?",
  "questionSeven": "Explain your reasoning."
}
```

#### Get Part 3
```http
GET /api/speaking/:id/part3
Authorization: Bearer <token>
```

#### Update Part 3
```http
PUT /api/speaking/:id/part3/:index
Authorization: Bearer <token>
Content-Type: application/json

{
  "passage": "Updated scenario...",
  "questionFive": "Updated question...",
  "questionSix": "Updated question...",
  "questionSeven": "Updated question..."
}
```

#### Delete Part 3
```http
DELETE /api/speaking/:id/part3/:index
Authorization: Bearer <token>
```

---

### Part 4: Respond to Questions using Information Provided (Câu 8-10)

#### Create Part 4
```http
POST /api/speaking/:id/part4
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- index: 1 (number)
- passage: "Information about schedule/chart..." (string)
- image: [image file] (optional)
- questionEight: "What time is the meeting?" (string)
- questionNine: "How many participants?" (string)
- questionTen: "Explain the trend."
```

#### Get Part 4
```http
GET /api/speaking/:id/part4
Authorization: Bearer <token>
```

#### Update Part 4
```http
PUT /api/speaking/:id/part4/:index
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- passage: "Updated info..." (string, optional)
- image: [image file] (optional)
- questionEight: "Updated question..." (string, optional)
- questionNine: "Updated question..." (string, optional)
- questionTen: "Updated question..." (string, optional)
```

#### Delete Part 4
```http
DELETE /api/speaking/:id/part4/:index
Authorization: Bearer <token>
```

---

### Part 5: Express an Opinion (Câu 11)

#### Create Part 5
```http
POST /api/speaking/:id/part5
Authorization: Bearer <token>
Content-Type: application/json

{
  "index": 1,
  "question": "Do you think remote work is better than office work? Explain why."
}
```

#### Get Part 5
```http
GET /api/speaking/:id/part5
Authorization: Bearer <token>
```

#### Update Part 5
```http
PUT /api/speaking/:id/part5/:index
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Updated question..."
}
```

#### Delete Part 5
```http
DELETE /api/speaking/:id/part5/:index
Authorization: Bearer <token>
```

---

## Writing Exam API

### Base URL: `/api/writing`

### Main Exam Endpoints

#### 1. Create Writing Exam
```http
POST /api/writing
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "TOEIC Writing Test 1",
  "isActive": true
}
```

#### 2. Get All Writing Exams
```http
GET /api/writing?page=1&limit=10&search=test
Authorization: Bearer <token>
```

#### 3. Get Writing Exam by ID (with all parts)
```http
GET /api/writing/:id
Authorization: Bearer <token>
```

#### 4. Update Writing Exam
```http
PUT /api/writing/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Test Name",
  "isActive": false
}
```

#### 5. Toggle Active Status
```http
PATCH /api/writing/:id/toggle-active
Authorization: Bearer <token>
```

#### 6. Delete Writing Exam
```http
DELETE /api/writing/:id
Authorization: Bearer <token>
```

---

### Part 1: Write a Sentence Based on a Picture (Câu 1-5)

#### Create Part 1
```http
POST /api/writing/:id/part1
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- index: 1 (number)
- imageOne: [image file]
- imageTwo: [image file]
- imageThree: [image file]
- imageFour: [image file]
- imageFive: [image file]
```

#### Get Part 1
```http
GET /api/writing/:id/part1
Authorization: Bearer <token>
```

#### Update Part 1
```http
PUT /api/writing/:id/part1/:index
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- imageOne: [image file] (optional)
- imageTwo: [image file] (optional)
- imageThree: [image file] (optional)
- imageFour: [image file] (optional)
- imageFive: [image file] (optional)
```

#### Delete Part 1
```http
DELETE /api/writing/:id/part1/:index
Authorization: Bearer <token>
```

---

### Part 2: Respond to a Written Request (Câu 6-7)

#### Create Part 2
```http
POST /api/writing/:id/part2
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- index: 1 (number)
- imageSix: [image file]
- imageSeven: [image file]
```

#### Get Part 2
```http
GET /api/writing/:id/part2
Authorization: Bearer <token>
```

#### Update Part 2
```http
PUT /api/writing/:id/part2/:index
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- imageSix: [image file] (optional)
- imageSeven: [image file] (optional)
```

#### Delete Part 2
```http
DELETE /api/writing/:id/part2/:index
Authorization: Bearer <token>
```

---

### Part 3: Write an Opinion Essay (Câu 8)

#### Create Part 3
```http
POST /api/writing/:id/part3
Authorization: Bearer <token>
Content-Type: application/json

{
  "index": 1,
  "questionEight": "Some people prefer working from home while others prefer working in an office. Which do you prefer and why?"
}
```

#### Get Part 3
```http
GET /api/writing/:id/part3
Authorization: Bearer <token>
```

#### Update Part 3
```http
PUT /api/writing/:id/part3/:index
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionEight": "Updated question..."
}
```

#### Delete Part 3
```http
DELETE /api/writing/:id/part3/:index
Authorization: Bearer <token>
```

---

## Image Upload Details

### Upload Configuration
- **Max file size**: 5MB per image
- **Allowed formats**: JPG, JPEG, PNG, GIF
- **Storage location**: `uploads/speaking/` or `uploads/writing/`
- **Naming convention**: Timestamp-based filename (e.g., `1234567890.jpg`)

### Image Fields by Part

#### Speaking Exam:
- **Part 2**: `imageThree`, `imageFour`
- **Part 4**: `image` (optional)

#### Writing Exam:
- **Part 1**: `imageOne`, `imageTwo`, `imageThree`, `imageFour`, `imageFive`
- **Part 2**: `imageSix`, `imageSeven`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Pagination Format
For list endpoints with pagination:
```json
{
  "data": [ /* array of items */ ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalItems": 50
}
```

---

## Data Models

### Speaking Exam Structure
- **Part 1 (SpeakingOneTwo)**: 2 questions - Read a text aloud
- **Part 2 (SpeakingThreeFour)**: 2 questions - Describe a picture
- **Part 3 (SpeakingFiveToSeven)**: 3 questions - Respond to questions
- **Part 4 (SpeakingEightToTen)**: 3 questions - Respond using information
- **Part 5 (SpeakingEleven)**: 1 question - Express an opinion

**Total Questions**: 11

### Writing Exam Structure
- **Part 1 (WritingOneToFive)**: 5 questions - Write sentence based on picture
- **Part 2 (WritingSixSeven)**: 2 questions - Respond to written request
- **Part 3 (WritingEight)**: 1 question - Write opinion essay

**Total Questions**: 8

---

## Error Codes
- **400**: Bad Request (validation error, invalid data)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error