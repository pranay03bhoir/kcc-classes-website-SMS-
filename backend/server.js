require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDb = require("./database/db.connection");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const adminRoutes = require("./routes/admin.routes");
const commonRoutes = require("./routes/common.routes");
const { retryFailedEmails } = require("./utils/emailRetryService");
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.kccclasses.in",
  process.env.FRONTEND_URL,
  // Allow all Vercel preview URLs for development
  /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

console.log("Server starting with NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);
console.log("Allowed origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS request from origin:", origin);
    if (!origin) return callback(null, true); // Allow requests with no origin (mobile apps, curl)
    
    // Check if origin is explicitly allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("Origin allowed:", origin);
      return callback(null, true);
    }
    
    // Check regex patterns (for Vercel URLs)
    for (const allowedOrigin of allowedOrigins) {
      if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
        console.log("Origin allowed by regex:", origin);
        return callback(null, true);
      }
    }
    
    console.log("Origin blocked:", origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
connectToDb();
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/common", commonRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at Port ${process.env.PORT}`);
  
  // Start email retry service after 5 minutes, then every 30 minutes
  setTimeout(() => {
    console.log("Starting email retry service...");
    retryFailedEmails();
    
    // Run retry every 30 minutes
    setInterval(retryFailedEmails, 30 * 60 * 1000);
  }, 5 * 60 * 1000); // 5 minutes
});
