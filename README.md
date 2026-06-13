# Database Integration API

*Author:* Manoj Reddy
*Project:* DecodeLabs Full Stack Industrial Training — Project 3 | Batch 2026

---

## Project Overview

A full database integration project built with Node.js, Express, and MongoDB demonstrating real-world data relationships, CRUD operations, and schema-level data integrity. The system manages Students, Courses, and Enrollments — covering all three types of database relationships.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM with schema validation |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Database Relationships Covered

| Relationship | Implementation |
|-------------|---------------|
| One-to-One (1:1) | Student has one embedded Profile |
| One-to-Many (1:Many) | Student has many Enrollments |
| Many-to-Many (M:M) | Students enroll in many Courses via Enrollment junction |

---

## Project Structure

\\\`
database-integration/
├── server.js                        # Entry point
├── package.json                     # Dependencies and scripts
├── .env                             # Environment variables
├── config/
│   └── db.js                        # MongoDB connection
├── models/
│   ├── Student.js                   # Student schema with embedded Profile
│   ├── Course.js                    # Course schema
│   └── Enrollment.js                # Junction table (Many:Many)
├── controllers/
│   ├── studentController.js         # Student CRUD logic
│   ├── courseController.js          # Course CRUD logic
│   └── enrollmentController.js      # Enrollment CRUD logic
├── routes/
│   ├── studentRoutes.js             # Student routes
│   ├── courseRoutes.js              # Course routes
│   └── enrollmentRoutes.js          # Enrollment routes
└── middleware/
    └── errorHandler.js              # Global error handler
\\\`

---

## Setup and Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running locally

### Steps

\\\`bash
# Step 1 - Navigate to project folder
cd database-integration

# Step 2 - Install all dependencies
npm install

# Step 3 - Create .env file in root folder
PORT=8000
MONGO_URI=mongodb://localhost:27017/databaseIntegrationDB
NODE_ENV=development

# Step 4 - Start MongoDB (in a separate terminal)
mongod

# Step 5 - Start the server
npm run dev
\\\`

### Success Output
\\\`
Server running on http://localhost:8000
Environment: development
MongoDB Connected: localhost
\\\`

---

## API Endpoints

### Base URL: http://localhost:8000/api

#### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | Get all students |
| GET | /students/:id | Get student by ID with enrollments |
| POST | /students | Create new student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

#### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /courses | Get all courses |
| GET | /courses/:id | Get course with enrolled students |
| POST | /courses | Create new course |
| PUT | /courses/:id | Update course |
| DELETE | /courses/:id | Delete course |

#### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /enrollments | Get all enrollments |
| POST | /enrollments | Enroll student in course |
| PUT | /enrollments/:id | Update enrollment status or grade |
| DELETE | /enrollments/:id | Remove enrollment |

---

## Request and Response Examples

### POST /api/students — Create Student

*Request Body:*
\\\`json
{
  "name": "Manoj Reddy",
  "email": "manoj@example.com",
  "age": 22,
  "profile": {
    "phone": "9876543210",
    "address": "Lucknow, India",
    "gender": "male"
  }
}
\\\`

*Success Response (201):*
\\\`json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Manoj Reddy",
    "email": "manoj@example.com",
    "age": 22,
    "profile": {
      "phone": "9876543210",
      "address": "Lucknow, India",
      "gender": "male"
    },
    "isActive": true,
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
\\\`

---

### POST /api/courses — Create Course

*Request Body:*
\\\`json
{
  "title": "Full Stack Development",
  "description": "Complete MERN stack development course",
  "duration": 120,
  "category": "programming",
  "fees": 15000
}
\\\`

*Success Response (201):*
\\\`json
{
  "success": true,
  "message": "Course created successfully",
  "data": { ...newCourse }
}
\\\`

---

### POST /api/enrollments — Enroll Student

*Request Body:*
\\\`json
{
  "student": "STUDENT_ID",
  "course": "COURSE_ID"
}
\\\`

*Success Response (201):*
\\\`json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "student": { "name": "Manoj Reddy", "email": "manoj@example.com" },
    "course": { "title": "Full Stack Development" },
    "status": "active",
    "grade": "pending"
  }
}
\\\`

*Duplicate Error (409):*
\\\`json
{
  "success": false,
  "message": "Student is already enrolled in this course"
}
\\\`

---

### PUT /api/enrollments/:id — Update Grade

*Request Body:*
\\\`json
{
  "status": "completed",
  "grade": "A"
}
\\\`

---

## Data Models

### Student
\\\`
Student {
  name         String    required, 2-50 chars
  email        String    required, unique
  age          Number    required, 16-60
  profile {
    phone      String    optional
    address    String    optional
    gender     String    male/female/other
  }
  isActive     Boolean   default: true
  timestamps   auto-generated
}
\\\`

### Course
\\\`
Course {
  title        String    required, unique, 3-100 chars
  description  String    required, max 500 chars
  duration     Number    required, min 1 hour
  category     String    programming/design/business/science/arts
  fees         Number    required, min 0
  isActive     Boolean   default: true
  timestamps   auto-generated
}
\\\`

### Enrollment (Junction Table)
\\\`
Enrollment {
  student      ObjectId  ref: Student
  course       ObjectId  ref: Course
  enrolledAt   Date      default: now
  status       String    active/completed/dropped
  grade        String    A/B/C/D/F/pending
  timestamps   auto-generated
}
Unique Index: student + course (prevents duplicates)
\\\`

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate record |
| 500 | Internal Server Error | Unexpected error |

---

## Data Integrity Features

| Constraint | Implementation |
|-----------|---------------|
| UNIQUE | Email per student, title per course |
| NOT NULL | All required fields enforced at schema level |
| CHECK | Age range, valid enum values for status and grade |
| FOREIGN KEY | Student and Course references in Enrollment |
| DUPLICATE PREVENTION | Compound unique index on student + course |

---

## Key Skills Demonstrated

- Database schema design with relationships
- One-to-One, One-to-Many, Many-to-Many relationships
- CRUD operations on multiple collections
- Data integrity at schema level
- Mongoose populate for joining collections
- Duplicate prevention with compound indexes
- RESTful API architecture
- Global error handling

---

Design your schema with precision. Bridge the gap with the right integration tool.
Map your CRUD operations to RESTful standards. Shield your data with strict constraints.

*Author: Manoj Reddy | DecodeLabs Batch 2026*
