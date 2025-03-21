# Tutoring Academy Website with Student Management System (MERN Stack)
```markdown

## Overview
This project is a **full-featured tutoring academy website** with an integrated **student management system (SMS)** built using the **MERN (MongoDB, Express.js, React, Node.js) stack**. The platform allows tutors and administrators to manage student records, attendance, grades, courses, and notifications while providing a seamless learning experience for students.

## Table of Contents
- [Features](#features)
  - [Student Management System](#student-management-system)
  - [Website Features](#website-features)
- [Tech Stack](#tech-stack)
  - [Frontend (React.js)](#frontend-reactjs)
  - [Backend (Node.js, Express.js)](#backend-nodejs-expressjs)
  - [Database (MongoDB + Mongoose)](#database-mongodb--mongoose)
  - [Deployment](#deployment)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [Student Management](#student-management)
  - [Course Management](#course-management)
  - [Attendance & Grades](#attendance--grades)
- [Deployment Guide](#deployment-guide)
  - [Backend Deployment (AWS EC2)](#backend-deployment-aws-ec2)
  - [Frontend Deployment (Vercel/Netlify)](#frontend-deployment-vercelnetlify)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Need Help?](#need-help)

## Features

### Student Management System
- **Student Registration**: Admins can add, edit, and delete student profiles.
- **Attendance Tracking**: Mark student attendance and generate reports.
- **Grades & Performance Monitoring**: Tutors can update and analyze student progress.
- **Course Management**: Add and update course details with assigned tutors.
- **Fee Management**: Track payments and due fees.
- **Notifications & Announcements**: Send alerts and updates to students and parents.

### Website Features
- **Homepage**: Showcases tutoring services, courses, and testimonials.
- **Authentication & Authorization**: Secure login/signup with **JWT-based authentication**.
- **Role-Based Access Control**:
  - Admin: Full access to student records, finances, and user management.
  - Tutor: Limited access to assigned courses and student performance.
  - Student: Access to personal academic records and notifications.
- **Responsive UI**: Fully mobile-friendly design.
- **Cloud Storage**: Images and documents are stored using **AWS S3/Cloudinary**.
- **Deployment**: Hosted on **AWS EC2 with an Nginx reverse proxy**.

## Tech Stack

### Frontend (React.js)
- React Router
- Redux Toolkit (for state management)
- Tailwind CSS for UI styling

### Backend (Node.js, Express.js)
- Express.js (REST API framework)
- JSON Web Tokens (JWT) for authentication
- Cloudinary/AWS S3 for image uploads
- Nodemailer for email notifications

### Database (MongoDB + Mongoose)
- MongoDB Atlas for cloud database
- Mongoose for schema validation

### Deployment
- **Frontend**: Deployed on Vercel/Netlify
- **Backend**: Deployed on AWS EC2 (Ubuntu)
- **Database**: MongoDB Atlas
- **Storage**: AWS S3/Cloudinary

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **MongoDB** (local or Atlas)
- **Git**

### Clone the Repository
```sh
git clone https://github.com/pranay03bhoir/kcc-classes-website-SMS-.git
cd kcc-classes-website-sms-
```

### Backend Setup
```sh
cd backend
npm install
```
#### Create a `.env` file in the backend directory and add:
```plaintext
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
#### Run Backend Server
```sh
npm start
```

### Frontend Setup
```sh
cd ../frontend
npm install
npm start
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login user

### Student Management
- `GET /api/students/` - Get all students
- `POST /api/students/` - Add a new student
- `PUT /api/students/:id` - Update student details
- `DELETE /api/students/:id` - Remove a student

### Course Management
- `GET /api/courses/` - Get all courses
- `POST /api/courses/` - Add a new course

### Attendance & Grades
- `POST /api/attendance/:studentId` - Mark attendance
- `POST /api/grades/:studentId` - Add student grades

## Deployment Guide

### Backend Deployment (AWS EC2)
1. SSH into your EC2 instance
2. Install Node.js and MongoDB
3. Clone the repo and setup environment variables
4. Use **PM2** to keep the server running:
   ```sh
   npm install -g pm2
   pm2 start server.js --name tutoring-backend
   ```
5. Set up Nginx as a reverse proxy

### Frontend Deployment (Vercel/Netlify)
1. Deploy the frontend via **Vercel** or **Netlify**.
2. Update the API base URL to point to the deployed backend.

## Future Enhancements
- **AI-Powered Performance Insights**
- **Live Class Integration**
- **Mobile App (React Native)**
- **More Payment Gateway Options**

## Contributing
We welcome contributions! Feel free to open issues or submit pull requests.

## License
MIT License

## Need Help?
For any queries, contact us at **kccclasses.KCC@gmail.com**.
```