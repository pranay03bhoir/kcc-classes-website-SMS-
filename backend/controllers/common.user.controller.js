const jwt = require("jsonwebtoken");
const Course = require("../models/subject.model");
const Teacher = require("../models/teacher.model");
const Topper = require("../models/topper.model");
const RegistrationLead = require("../models/registrationLead.model");
const ContactInquiry = require("../models/contactInquiry.model");
const Testimonial = require("../models/testimonial.model");
const {
  sendRegistrationNotificationToOwner,
  sendContactInquiryToOwner,
} = require("../utils/registrationMailer");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CONTACT_RE = /^\+?[1-9]\d{9,14}$/;

/** Maps course subject name to FindYourMentor filter slug. */
function subjectNameToMentorSlug(name) {
  const n = String(name || "").toLowerCase();
  if (/math|mathematics/.test(n)) return "math";
  if (/physics/.test(n)) return "physics";
  if (/chemistry/.test(n)) return "chemistry";
  if (/english/.test(n)) return "english";
  if (/biology/.test(n)) return "biology";
  if (/commerce|accountancy|business studies|economics/.test(n)) {
    return "commerce";
  }
  if (/\bscience\b/.test(n)) return "science";
  const slug = n.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return slug || "science";
}

function categoryToGradeBand(category) {
  switch (category) {
    case "Middle School":
    case "High School":
      return "5-10";
    case "Science Stream":
      return "11-12 science";
    case "Commerce Stream":
      return "11-12 commerce";
    default:
      return null;
  }
}

function validateRegistrationPayload(body) {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    pin,
    currentClass,
    school,
    subjects,
    batch,
    agree,
  } = body || {};

  if (!firstName || String(firstName).trim().length < 2) {
    return "First name must be at least 2 characters";
  }
  if (!lastName || String(lastName).trim().length < 2) {
    return "Last name must be at least 2 characters";
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return "Please enter a valid email address";
  }
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length !== 10) {
    return "Please enter a valid 10-digit phone number";
  }
  if (!address || !String(address).trim()) {
    return "Address is required";
  }
  if (!city || !String(city).trim()) {
    return "City is required";
  }
  if (!/^[0-9]{6}$/.test(String(pin || "").trim())) {
    return "Please enter a valid 6-digit PIN code";
  }
  if (!currentClass || !String(currentClass).trim()) {
    return "Class is required";
  }
  if (!school || !String(school).trim()) {
    return "School is required";
  }
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return "Select at least one subject";
  }
  if (!batch || !String(batch).trim()) {
    return "Batch is required";
  }
  if (agree !== true) {
    return "You must agree to the terms and conditions";
  }
  return null;
}

function validateContactPayload(body) {
  const { fullName, email, phone, subject, grade, message, consent } =
    body || {};

  if (!fullName || String(fullName).trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return "Invalid email address";
  }
  const phoneNorm = String(phone || "").replace(/\s/g, "");
  if (!PHONE_CONTACT_RE.test(phoneNorm)) {
    return "Invalid phone number";
  }
  if (!subject || !String(subject).trim()) {
    return "Please select a subject";
  }
  const gradeTrim = String(grade || "").trim();
  if (!gradeTrim || gradeTrim === "Select Grade/Class") {
    return "Please select a grade";
  }
  if (!message || String(message).trim().length < 10) {
    return "Message must be at least 10 characters";
  }
  const consentOk = consent === true || consent === "true" || consent === "on";
  if (!consentOk) {
    return "You must agree to the terms";
  }
  return null;
}

function userAuthCheck(req, res) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ loggedIn: true, role: decoded.role });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses to offer" });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const searchATeacher = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search term is required" });
    }
    const teacher = await Teacher.find({
      $regex: { name: search, $options: "i" },
    });
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }
    return res.status(200).json({ teacher });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getAllToppers = async (req, res) => {
  try {
    const toppers = await Topper.find();
    if (!toppers || toppers.length === 0) {
      return res.status(404).json({ message: "No toppers found" });
    }
    return res.status(200).json({ toppers });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/** Public faculty directory for the marketing site (no passwords or tokens). */
const getPublicFaculty = async (req, res) => {
  try {
    const teachers = await Teacher.find({})
      .select("-password -refreshToken")
      .populate("subjects", "name description category rating")
      .sort({ name: 1 })
      .lean();

    const faculty = teachers.map((t) => {
      const subjectDocs = Array.isArray(t.subjects) ? t.subjects : [];
      const names = subjectDocs.map((s) => s?.name).filter(Boolean);
      const primary = names[0] || "Faculty";
      const firstWithDesc = subjectDocs.find((s) => s?.description);
      const description =
        (firstWithDesc && String(firstWithDesc.description).trim()) ||
        (names.length
          ? `Teaching ${names.join(", ")}.`
          : "KCC Classes faculty member.");

      const achievements = [];
      if (names.length) {
        achievements.push(`Subjects: ${names.join(", ")}`);
      }
      if (t.joiningYear) {
        achievements.push(`Faculty since ${t.joiningYear}`);
      }
      if (t.teacherId) {
        achievements.push(`ID: ${t.teacherId}`);
      }

      const subjectSlugs = [
        ...new Set(subjectDocs.map((s) => subjectNameToMentorSlug(s?.name))),
      ];
      const gradeBands = [
        ...new Set(
          subjectDocs
            .map((s) => categoryToGradeBand(s?.category))
            .filter(Boolean),
        ),
      ];
      const ratings = subjectDocs
        .map((s) => s?.rating)
        .filter((r) => typeof r === "number" && !Number.isNaN(r) && r > 0);
      const avgRating =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10,
            ) / 10
          : null;
      const batchCount = Array.isArray(t.batches) ? t.batches.length : 0;

      return {
        id: String(t._id),
        name: t.name,
        teacherId: t.teacherId,
        subject: primary,
        subjects: names,
        subjectSlug: subjectSlugs[0] || "science",
        subjectSlugs,
        gradeBands,
        rating: avgRating,
        batchCount,
        description,
        image: t.profileImage || "",
        social: {
          email: t.email,
          linkedin: null,
          twitter: null,
        },
        achievements: achievements.length
          ? achievements
          : ["KCC Classes faculty"],
        expertise: names,
      };
    });

    return res.status(200).json({ faculty });
  } catch (error) {
    console.error("getPublicFaculty:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitRegistrationLead = async (req, res) => {
  try {
    const message = validateRegistrationPayload(req.body);
    if (message) {
      return res.status(400).json({ message });
    }

    const {
      firstName,
      lastName,
      dob = "",
      gender = "",
      email,
      phone,
      address,
      city,
      pin,
      currentClass,
      school,
      subjects,
      batch,
      additionalInfo = "",
      agree,
    } = req.body;

    const normalized = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      dob: String(dob || "").trim(),
      gender: String(gender || "").trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).replace(/\D/g, ""),
      address: String(address).trim(),
      city: String(city).trim(),
      pin: String(pin).trim(),
      currentClass: String(currentClass).trim(),
      school: String(school).trim(),
      subjects: subjects.map((s) => String(s)),
      batch: String(batch).trim(),
      additionalInfo: String(additionalInfo || "").trim(),
      agree: Boolean(agree),
    };

    const doc = await RegistrationLead.create(normalized);

    try {
      await sendRegistrationNotificationToOwner(normalized);
    } catch (emailErr) {
      await RegistrationLead.findByIdAndDelete(doc._id);
      console.error("submitRegistrationLead email:", emailErr);
      return res.status(503).json({
        message:
          "We could not send your registration notification. Please try again in a few minutes, or contact us directly.",
      });
    }

    return res.status(201).json({
      message: "Registration received. We'll contact you soon.",
      id: doc._id,
    });
  } catch (error) {
    console.error("submitRegistrationLead:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitContactInquiry = async (req, res) => {
  try {
    const message = validateContactPayload(req.body);
    if (message) {
      return res.status(400).json({ message });
    }

    const {
      fullName,
      email,
      phone,
      subject,
      grade,
      message: msg,
      consent,
    } = req.body;

    const phoneNorm = String(phone).replace(/\s/g, "");

    const normalized = {
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phoneNorm,
      subject: String(subject).trim(),
      grade: String(grade).trim(),
      message: String(msg).trim(),
      consent: consent === true || consent === "true" || consent === "on",
    };

    const doc = await ContactInquiry.create(normalized);

    // Try to send email, but don't fail the submission if email fails
    try {
      await sendContactInquiryToOwner(normalized);
    } catch (emailErr) {
      // Don't delete the inquiry - keep it and retry email later
      // The submission is successful, just email notification failed
      
      // Optional: Add a retry mechanism or flag for manual review
      await ContactInquiry.findByIdAndUpdate(doc._id, { 
        emailNotificationFailed: true,
        emailFailureReason: emailErr.message
      });
    }

    return res.status(201).json({
      message: "Message sent successfully! We'll get back to you soon.",
      id: doc._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPublicTestimonials = async (req, res) => {
  try {
    const docs = await Testimonial.find({
      status: { $in: ["approved", "pending"] },
    })
      .populate("student", "name currentStd profileImage")
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    const testimonials = docs.map((d) => {
      const s = d.student;
      const name =
        (d.displayName && String(d.displayName).trim()) ||
        s?.name ||
        "Student";
      const std = (s?.currentStd || "").trim();
      const roleFromProfile = std ? `${std} Student` : "Student";
      const role =
        (d.displayRole && String(d.displayRole).trim()) || roleFromProfile;
      const image =
        (d.displayImage && String(d.displayImage).trim()) ||
        (s?.profileImage && String(s.profileImage).trim()) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=fef2f2&color=b91c1c`;
      return {
        id: String(d._id),
        name,
        role,
        image,
        rating: d.rating,
        testimonial: d.text,
      };
    });

    return res.status(200).json({ testimonials });
  } catch (error) {
    console.error("getPublicTestimonials:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userAuthCheck,
  getAllCourses,
  searchATeacher,
  getAllToppers,
  getPublicFaculty,
  getPublicTestimonials,
  submitRegistrationLead,
  submitContactInquiry,
};
