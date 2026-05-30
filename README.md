##eClass - Platform (Backend)

A RESTful API for eClass platform, build with Node.js, Express and PostgreSQL.

Features: Secure authentication, role-based access control and course managment.

##Tech Stack

-Node.js & Express -> server & routing
-PostgreSQL -> relational database
-JWT -> authetication tokens
-bcrypt -> password hashing
-dotenv -> enviroment configuration

##Features

-Secure authentication with JWT (2-hour expiry)
-Password hashing with bcrypt
-Role-based access control (teacher / student)
-Email domain validation (@uni.gr for teachers, @students.uni.gr for students)
-Invitation token system for teacher registration
-Protected routes via custom middleware

##API Endpoints

-Authentication

| Method |       Endpoint       |                Description                 |
|--------|----------------------|--------------------------------------------|
|  POST  | `/api/auth/register` | Register a new user (auto role assignment) |
|  POST  | `/api/auth/login`    | Log in and receive a JWT token             |

-Teacher

| Method |          Endpoint            |                Description                 |
|--------|------------------------------|--------------------------------------------|
|  POST  | `/api/teacher/create-course` |       Create a new course                  |
|  GET   | `/api/teacher/my-courses`    |       Get all courses by the teacher       |

-Authentication Flow

• User registers → role assigned automatically based on email domain & invitation token
• User logs in → receives a JWT token containing their id & role
• Protected requests include the token: `Authorization: Bearer <token>`
• Middleware verifies the token and checks the user's role before granting access

-Example Request

##Register a student:

    POST /api/auth/register
    {
    "name": "Maria Example",
    "email": "maria@students.uni.gr",
    "password": "********"
    }

##Create a course (teacher):

    POST /api/teacher/create-course

    Headers: { "Authorization": "Bearer <token>" }

    {
    "title": "Introduction to Programming",
    "description": "JavaScript fundamentals"
    }

##Project Structure

backend/
    middleware/
        verifyToken.js
        verifyTeacher.js
        verifyStudent.js
    routes/
        auth.js
        teacher.js
    db.js
    server.js 