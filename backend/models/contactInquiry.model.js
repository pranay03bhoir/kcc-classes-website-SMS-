const mongoose = require("mongoose");

const contactInquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

contactInquirySchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("ContactInquiry", contactInquirySchema);
