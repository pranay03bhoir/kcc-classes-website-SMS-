const mongoose = require("mongoose");

const registrationLeadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pin: { type: String, required: true, trim: true },
    currentClass: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    subjects: [{ type: String }],
    batch: { type: String, required: true, trim: true },
    additionalInfo: { type: String, default: "" },
    agree: { type: Boolean, required: true },
  },
  { timestamps: true }
);

registrationLeadSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("RegistrationLead", registrationLeadSchema);
