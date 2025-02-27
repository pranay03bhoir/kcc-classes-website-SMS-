require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/db.connection");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const app = express();

app.use(express.json());
connectToDb();
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at Port ${process.env.PORT}`);
});
