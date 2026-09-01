# KCC Classes Website & Student Management System

A modern, full-featured tutoring academy website with an integrated Student Management System (SMS), built using the **MERN stack** (MongoDB, Express.js, React/Next.js, Node.js). This platform enables administrators, teachers, and students to manage academic activities, attendance, grades, and more, all within a responsive, user-friendly interface.

---

## Table of Contents
- [KCC Classes Website \& Student Management System](#kcc-classes-website--student-management-system)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [Student Management System](#student-management-system)
    - [Website Features](#website-features)
  - [Tech Stack](#tech-stack)
  - [Folder Structure](#folder-structure)
  - [Installation \& Setup](#installation--setup)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Backend Setup](#2-backend-setup)
    - [3. Frontend Setup](#3-frontend-setup)
  - [Environment Variables](#environment-variables)
    - [Backend (`backend/.env`)](#backend-backendenv)
    - [Frontend](#frontend)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Students](#students)
    - [Courses](#courses)
    - [Attendance \& Grades](#attendance--grades)
  - [Usage](#usage)
  - [Deployment Guide](#deployment-guide)
    - [Backend (AWS EC2)](#backend-aws-ec2)
    - [Frontend (Vercel/Netlify/AWS Amplify)](#frontend-vercelnetlifyaws-amplify)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Need Help?](#need-help)

---

## Project Overview
KCC Classes Website is a comprehensive platform for managing tutoring operations, including student registration, attendance, grades, courses, and notifications. The system supports role-based access for admins, teachers, and students, ensuring secure and efficient management of academic workflows.

---

## Features
### Student Management System
- **Student Registration & Profiles**: Admins can add, edit, and delete student records.
- **Attendance Tracking**: Mark and review attendance for all students.
- **Grades & Performance**: Teachers can update and analyze student scores.
- **Course Management**: Create, assign, and update courses and batches.
- **Notifications**: Send announcements to students and parents.
- **Role-Based Access**: Secure dashboards for Admin, Teacher, and Student roles.

### Website Features
- **Homepage**: Showcases services, courses, testimonials, and faculty.
- **Authentication**: Secure login/signup with JWT-based authentication.
- **Responsive UI**: Mobile-friendly, modern design using Tailwind CSS.
- **Cloud Storage**: Store images and documents via AWS S3 or Cloudinary.
- **Email Notifications**: Automated emails for verification and updates.

---

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, JWT, Nodemailer
- **Database**: MongoDB (Atlas), Mongoose
- **Storage**: AWS S3 / Cloudinary
- **Deployment**: Vercel/Netlify/AWS Amplify (Frontend), AWS EC2 (Backend)

---

## Folder Structure
```
kcc-classes-website-SMS-/
├── backend/                  # Express.js API, models, controllers, routes
│   ├── controllers/          # Route controllers
│   │   ├── admin.controller.js
│   │   ├── student.controller.js
│   │   ├── teacher.controller.js
│   │   ├── common.user.controller.js
│   │   └── controller features/
│   │       ├── admin features/
│   │       │   └── admin.md
│   │       ├── student features/
│   │       │   └── student.md
│   │       └── teachers features/
│   │           └── teacher.md
│   ├── database/
│   │   └── db.connection.js
│   ├── middlewares/          # Auth and other middleware
│   │   ├── adminAuth.middleware.js
│   │   ├── loginAuth.middleware.js
│   │   └── teacherAuth.middleware.js
│   ├── models/               # Mongoose models
│   │   ├── admin.model.js
│   │   ├── attendance.model.js
│   │   ├── batch.model.js
│   │   ├── batchCounter.model.js
│   │   ├── counterStudent.model.js
│   │   ├── counterTeacher.model.js
│   │   ├── models.md
│   │   ├── quiz.model.js
│   │   ├── quizAttempt.model.js
│   │   ├── score.model.js
│   │   ├── student.model.js
│   │   ├── subject.model.js
│   │   └── teacher.model.js
│   ├── routes/               # Express routes
│   │   ├── admin.routes.js
│   │   ├── common.routes.js
│   │   ├── student.routes.js
│   │   └── teacher.routes.js
│   ├── utils/                # Utility functions & email templates
│   │   ├── admin.email.js
│   │   ├── email.js
│   │   ├── student.email.js
│   │   └── templates/
│   │       └── verification.html
│   ├── docs/
│   └── server.js
├── frontend/                 # Next.js app, components, pages, styles
│   ├── src/
│   │   ├── app/              # App directory (routing, pages, dashboards)
│   │   │   ├── aboutus/
│   │   │   ├── admindashboard/
│   │   │   │   ├── attendance/
│   │   │   │   ├── courses/
│   │   │   │   ├── scores/
│   │   │   │   ├── settings/
│   │   │   │   ├── students/
│   │   │   │   └── page.jsx
│   │   │   ├── contact/
│   │   │   ├── courses/
│   │   │   ├── faculty/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   │   └── [role]/
│   │   │   ├── register/
│   │   │   │   ├── admin-register/
│   │   │   │   ├── student-register/
│   │   │   │   └── teacher-register/
│   │   │   ├── studentdashboard/
│   │   │   │   ├── courses/
│   │   │   │   └── page.jsx
│   │   │   ├── teacherDashboard/
│   │   │   │   ├── attendance/
│   │   │   │   ├── scores/
│   │   │   │   ├── settings/
│   │   │   │   ├── students/
│   │   │   │   └── page.jsx
│   │   │   ├── layout.js
│   │   │   ├── layout.jsx
│   │   │   ├── page.js
│   │   │   └── providers.jsx
│   │   ├── components/       # Reusable UI and feature components
│   │   │   ├── ui/
│   │   │   ├── NavigationBar/
│   │   │   ├── LoginComponent/
│   │   │   ├── ContactUs/
│   │   │   ├── Faculty/
│   │   │   ├── FormComponent/
│   │   │   ├── CoursesExploration/
│   │   │   ├── EducationalPrograms/
│   │   │   ├── Heading/
│   │   │   ├── CardComponent/
│   │   │   ├── Home/
│   │   │   ├── aboutUs/
│   │   │   ├── Footer/
│   │   │   └── Carousel/
│   │   ├── Dashboard/        # Dashboards for each role
│   │   │   ├── AdminDashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── modals/
│   │   │   │   │   ├── attendance-modals/
│   │   │   │   │   └── StudentManagementComponents/
│   │   │   ├── TeacherDashboard/
│   │   │   │   ├── AttendanceManagement/
│   │   │   │   │   └── Modals/
│   │   │   │   ├── StudentManagement/
│   │   │   │   │   ├── modals/
│   │   │   │   │   └── studentScoreManagement/
│   │   │   └── StudentDashboard/
│   │   │       └── enrolledCourses/
│   │   ├── hooks/
│   │   ├── data/
│   │   ├── lib/
│   │   └── utils/
│   └── public/
│       ├── images/
│       ├── KCC-CLASSES.png
│       ├── teacher-teaching.jpg
│       ├── KCC-icon.jpeg
│       ├── next.svg
│       ├── vercel.svg
│       ├── window.svg
│       ├── file.svg
│       └── globe.svg
└── README.md
```

---

## Installation & Setup
### Prerequisites
- **Node.js** (LTS recommended)
- **MongoDB** (local or Atlas)
- **Git**

### 1. Clone the Repository
```sh
git clone https://github.com/pranay03bhoir/kcc-classes-website-SMS-.git
cd kcc-classes-website-SMS-
```

### 2. Backend Setup
```sh
cd backend
npm install
```
- Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables))
- Start the backend server:
```sh
npm start
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev
```

---

## Environment Variables
### Backend (`backend/.env`)
```
ADMIN_BASE_URL=http://localhost:5000/api/admin
CROSS_SITE=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PASS=your_email_pass
EMAIL_PORT=587
EMAIL_USER=your_email_username
FRONTEND_URL=http://localhost:3000/
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_SECRET=your_jwt_access_secret
MONGO_URI=your_mongo_uri
NODE_ENV=your_production_environment
PORT=5000
STUDENT_BASE_URL=http://localhost:5000/api/student
TEACHER_BASE_URL=http://localhost:5000/api/teacher
```

### Frontend
- Update API base URLs in the frontend as needed (see `src/utils/axios.js` and related files).

---

## API Endpoints
### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user

### Students
- `GET /api/students/` — List all students
- `POST /api/students/` — Add student
- `PUT /api/students/:id` — Update student
- `DELETE /api/students/:id` — Delete student

### Courses
- `GET /api/courses/` — List all courses
- `POST /api/courses/` — Add course

### Attendance & Grades
- `POST /api/attendance/:studentId` — Mark attendance
- `POST /api/grades/:studentId` — Add grades

---

## Usage
- **Admin Dashboard**: Manage students, teachers, courses, attendance, and scores.
- **Teacher Dashboard**: View assigned courses, mark attendance, update student scores.
- **Student Dashboard**: View personal academic records, attendance, and notifications.

---

## Deployment Guide
### Backend (AWS EC2)
1. SSH into your EC2 instance
2. Install Node.js and MongoDB
3. Clone the repo and set up environment variables
4. Use **PM2** to run the server:
   ```sh
   npm install -g pm2
   pm2 start server.js --name kcc-backend
   ```
5. Set up Nginx as a reverse proxy (optional)

### Frontend (Vercel/Netlify/AWS Amplify)
1. Deploy the frontend via Vercel or Netlify or AWS Amplify.
2. Update API URLs to point to your backend.

---

## License
MIT License

---

## Contact
For queries or support, email: **pranaytb777@gmail.com**


## Need Help?
For any queries, contact us at **pranaytb777@gmail.com**.

