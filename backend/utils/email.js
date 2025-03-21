const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationURL = `http://localhost:5000/api/students/verify-email?token=${token}`;

    // Read HTML template
    let template = fs.readFileSync(
      path.join(__dirname, "templates", "verification.html"),
      "utf8",
    );

    // Replace placeholder with actual verification URL
    template = template.replace("{{verification_link}}", verificationURL);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: template, // Use the processed HTML template
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = { sendVerificationEmail };
