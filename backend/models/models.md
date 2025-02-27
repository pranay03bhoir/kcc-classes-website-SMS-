Sure! Below are the **Mongoose schemas** for all the models required in your **Student Management System (SMS)**.

---

# **📌 Mongoose Models for SMS (Student Management System)**
Each schema defines the structure for different users and features in the system.

---

## **1️⃣ Student Model (`models/Student.js`)**
**Fields:**
- **name, email, password** → Basic details
- **role** → Defines user type (`"student"`)
- **courses** → Stores enrolled courses
- **attendance** → Stores attendance records
- **grades** → Stores student grades
- **profileImage** → URL of profile picture (stored in AWS S3)

```js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  profileImage: { type: String, default: "" }, // Stored in AWS S3
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
    },
  ],
  grades: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      score: { type: Number, required: true },
      grade: { type: String }, // Example: "A", "B+", etc.
    },
  ],
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
```

---

## **2️⃣ Teacher Model (`models/Teacher.js`)**
**Fields:**
- **name, email, password** → Basic details
- **role** → `"teacher"`
- **courses** → Stores courses assigned to the teacher
- **profileImage** → URL of profile picture

```js
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
  profileImage: { type: String, default: "" },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
```

---

## **3️⃣ Admin Model (`models/Admin.js`)**
**Fields:**
- **name, email, password** → Basic details
- **role** → `"admin"`

```js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
```

---

## **4️⃣ Course Model (`models/Course.js`)**
**Fields:**
- **name** → Course title
- **code** → Unique course code
- **teacher** → Assigned teacher
- **students** → Enrolled students

```js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
```

---

## **5️⃣ Attendance Model (`models/Attendance.js`)**
**Fields:**
- **student** → Linked student
- **course** → Linked course
- **date** → Attendance date
- **status** → `"Present"`, `"Absent"`, or `"Late"`

```js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
```

---

## **6️⃣ Grade Model (`models/Grade.js`)**
**Fields:**
- **student** → Linked student
- **course** → Linked course
- **score** → Numeric score
- **grade** → Letter grade

```js
import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Grade", gradeSchema);
```

---

## **7️⃣ Notification Model (`models/Notification.js`)**
**Fields:**
- **recipient** → Student or teacher receiving the notification
- **message** → Notification content
- **type** → `"grade_update"`, `"attendance_alert"`, `"announcement"`
- **read** → Whether the user has seen the notification

```js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, refPath: "recipientModel", required: true },
  recipientModel: { type: String, enum: ["Student", "Teacher"], required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["grade_update", "attendance_alert", "announcement"], required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
```

---

## **8️⃣ Payment Model (`models/Payment.js`)**
**Fields:**
- **student** → Student who made the payment
- **amount** → Payment amount
- **status** → `"Pending"`, `"Completed"`, `"Failed"`
- **paymentMethod** → `"Credit Card"`, `"Bank Transfer"`, `"UPI"`

```js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "Bank Transfer", "UPI"], required: true },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
```

---

## **🔹 Relationships Between Models**
1. **Students & Courses** → Many-to-Many (students enroll in multiple courses, courses have multiple students).
2. **Teachers & Courses** → One-to-Many (each course has one teacher).
3. **Attendance & Students** → One-to-Many (students have multiple attendance records).
4. **Grades & Students** → One-to-Many (students receive grades for multiple courses).
5. **Notifications** → Can be sent to both students and teachers.

---

### **🔥 Next Steps**
- ✅ Create **Express Routes** for CRUD operations (`controllers/`)
- ✅ Implement **JWT-based authentication** (`middlewares/auth.js`)
- ✅ Deploy MongoDB database (**MongoDB Atlas** or **AWS RDS**)
- ✅ Secure APIs & Optimize queries

This should give you a **fully structured database** for your **Student Management System**. Let me know if you need **any modifications or additional features!** 🚀🔥