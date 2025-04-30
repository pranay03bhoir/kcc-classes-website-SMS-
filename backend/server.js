require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDb = require("./database/db.connection");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();

const allowedOrigin =
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.FRONTEND_URL
    : "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));
connectToDb();
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at Port ${process.env.PORT}`);
});
