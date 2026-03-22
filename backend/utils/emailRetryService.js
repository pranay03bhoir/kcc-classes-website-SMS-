// Email retry service for failed notifications
const ContactInquiry = require("../models/contactInquiry.model");
const { sendContactInquiryToOwner } = require("./registrationMailer");

const retryFailedEmails = async () => {
  try {
    const failedInquiries = await ContactInquiry.find({
      emailNotificationFailed: true
    }).limit(10); // Process 10 at a time

    for (const inquiry of failedInquiries) {
      try {
        await sendContactInquiryToOwner(inquiry.toObject());
        
        // Mark as successful
        await ContactInquiry.findByIdAndUpdate(inquiry._id, {
          emailNotificationFailed: false,
          emailFailureReason: null,
          emailRetryCount: (inquiry.emailRetryCount || 0) + 1,
          lastEmailRetry: new Date()
        });
      } catch (error) {
        // Update retry count
        await ContactInquiry.findByIdAndUpdate(inquiry._id, {
          emailRetryCount: (inquiry.emailRetryCount || 0) + 1,
          lastEmailRetry: new Date()
        });
      }
    }
  } catch (error) {
    // Silently handle service errors
  }
};

module.exports = { retryFailedEmails };
