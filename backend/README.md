# Tutoring Academy Website - Student Management System (MERN Stack)

## Overview
This is the backend of the Tutoring Academy Website, a student management system built using the MERN (MongoDB, Express.js, React, Node.js) stack. The backend is responsible for handling authentication, authorization, course management, student records, attendance tracking, and other essential functionalities.

## Features
- User authentication and authorization (JWT-based authentication)
- Role-based access control (Admin, Tutor, Student)
- Student registration and profile management
- Course creation, modification, and deletion
- Attendance tracking
- Grade management
- Notifications system
- Cloudinary integration for image uploads
- Secure API endpoints

## Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework for handling API requests
- **MongoDB** - NoSQL database for storing student and course data
- **Mongoose** - ODM for MongoDB
- **JSON Web Tokens (JWT)** - Authentication and authorization
- **Cloudinary** - Image storage and management
- **AWS (EC2, S3, RDS)** - Deployment and cloud storage

## Project Structure
```
backend/
├── controllers/        # Business logic for handling requests
├── database/           # Database connection and configuration
├── middlewares/        # Middleware functions (authentication, validation)
├── models/             # Mongoose models for MongoDB collections
├── routes/             # Express.js routes
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Lock file for package dependencies
├── server.js           # Main entry point of the backend
├── README.md           # Documentation file
```

## Installation & Setup
### Prerequisites
- Node.js (latest LTS version)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)
- AWS account for deployment (if applicable)

### Steps to Set Up Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/kcc-classes-website-SMS-.git
   cd tutoring-academy-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
   ```sh
   npm start
   ```
   The backend should now be running on `http://localhost:5000`.

## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `PUT /api/students/:id` - Update student details
- `DELETE /api/students/:id` - Remove a student

### Course Management
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add a new course
- `PUT /api/courses/:id` - Update course details
- `DELETE /api/courses/:id` - Remove a course

### Attendance
- `POST /api/attendance` - Mark student attendance
- `GET /api/attendance/:id` - Get attendance records

## Deployment
### Deploying to AWS (EC2, S3, RDS)
1. Set up an EC2 instance and SSH into the server.
2. Install Node.js and MongoDB.
3. Clone the repository and install dependencies.
4. Set up environment variables.
5. Use PM2 to keep the server running:
   ```sh
   pm2 start server.js --name tutoring-academy
   ```

## Contributing
If you’d like to contribute, feel free to submit a pull request with enhancements or bug fixes.

## License
This project is licensed under the MIT License.

