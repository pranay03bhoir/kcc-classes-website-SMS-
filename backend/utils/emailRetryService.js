// Email retry service for failed notifications
const ContactInquiry = require("../models/contactInquiry.model");
const { sendContactInquiryToOwner } = require("./registrationMailer");

const retryFailedEmails = async () => {
  try {
    const failedInquiries = await ContactInquiry.find({
      emailNotificationFailed: true
    }).limit(10); // Process 10 at a time

    console.log(`Found ${failedInquiries.length} failed email notifications to retry`);

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

        console.log(`Email retry successful for inquiry: ${inquiry._id}`);
      } catch (error) {
        console.error(`Email retry failed for inquiry ${inquiry._id}:`, error.message);
        
        // Update retry count
        await ContactInquiry.findByIdAndUpdate(inquiry._id, {
          emailRetryCount: (inquiry.emailRetryCount || 0) + 1,
          lastEmailRetry: new Date()
        });
      }
    }
  } catch (error) {
    console.error("Email retry service error:", error);
  }
};

module.exports = { retryFailedEmails };
