const nodemailer = require("nodemailer");

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
  const verificationURL = `http://localhost:5000/api/students/verify-email?token=${token}`;

  const mailOptions = {
    form: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `Click <a href="${verificationURL}">here</a> to verify your email.`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
