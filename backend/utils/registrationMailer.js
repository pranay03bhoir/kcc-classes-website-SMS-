const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveOwnerInbox() {
  const ownerEmail =
    process.env.OWNER_EMAIL ||
    process.env.CONTACT_NOTIFY_EMAIL ||
    process.env.REGISTRATION_NOTIFY_EMAIL ||
    process.env.EMAIL_USER;

  if (!ownerEmail) {
    const err = new Error(
      "OWNER_EMAIL or EMAIL_USER must be set to receive site notifications"
    );
    err.code = "OWNER_EMAIL_MISSING";
    throw err;
  }
  return ownerEmail;
}

function formatRegistrationEmailBody(data) {
  const lines = [
    ["First name", data.firstName],
    ["Last name", data.lastName],
    ["Date of birth", data.dob || "—"],
    ["Gender", data.gender || "—"],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Address", data.address],
    ["City", data.city],
    ["PIN", data.pin],
    ["Class", data.currentClass],
    ["School", data.school],
    ["Subjects", Array.isArray(data.subjects) ? data.subjects.join(", ") : "—"],
    ["Batch", data.batch],
    ["Additional info", data.additionalInfo || "—"],
  ];

  const text = [
    "New student registration (website form)",
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    `Reply directly to this message to reach the applicant at ${data.email}.`,
  ].join("\n");

  const rows = lines
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb;font-weight:600;width:160px;background:#f9fafb;">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;">${escapeHtml(String(v))}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;">
<p style="font-size:16px;font-weight:600;">New student registration</p>
<table style="border-collapse:collapse;max-width:640px;">${rows}</table>
<p style="font-size:13px;color:#6b7280;margin-top:16px;">Reply to this email to contact the applicant (${escapeHtml(data.email)}).</p>
</body></html>`;

  return { text, html };
}

/**
 * Sends the full registration payload to the site owner inbox.
 * @param {object} data Normalized field values (same shape as stored in DB)
 */
async function sendRegistrationNotificationToOwner(data) {
  const transporter = getTransporter();
  if (!transporter) {
    const err = new Error("Email is not configured (missing EMAIL_HOST, EMAIL_USER, or EMAIL_PASS)");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }

  const ownerEmail = resolveOwnerInbox();

  const from = process.env.MAIL_FROM || process.env.EMAIL_USER;
  const { text, html } = formatRegistrationEmailBody(data);
  const subject = `New registration: ${data.firstName} ${data.lastName}`;

  await transporter.sendMail({
    from: `"KCC Classes" <${from}>`,
    to: ownerEmail,
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

function formatContactInquiryEmailBody(data) {
  const lines = [
    ["Name", data.fullName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Subject", data.subject],
    ["Grade / class", data.grade],
    ["Message", data.message],
  ];

  const text = [
    "New contact form message (website)",
    "",
    ...lines.map(([k, v]) => `${k}: ${k === "Message" ? "\n" + v : v}`),
    "",
    `Reply to this message to reach ${data.email}.`,
  ].join("\n");

  const rows = lines
    .map(([k, v]) => {
      const cell =
        k === "Message"
          ? `<pre style="margin:0;white-space:pre-wrap;font-family:inherit;">${escapeHtml(String(v))}</pre>`
          : escapeHtml(String(v));
      return `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb;font-weight:600;width:160px;background:#f9fafb;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;">${cell}</td></tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;">
<p style="font-size:16px;font-weight:600;">New contact form message</p>
<table style="border-collapse:collapse;max-width:640px;">${rows}</table>
<p style="font-size:13px;color:#6b7280;margin-top:16px;">Reply to this email to contact ${escapeHtml(data.email)}.</p>
</body></html>`;

  return { text, html };
}

/**
 * Sends contact form fields to the site owner inbox.
 */
async function sendContactInquiryToOwner(data) {
  const transporter = getTransporter();
  if (!transporter) {
    const err = new Error(
      "Email is not configured (missing EMAIL_HOST, EMAIL_USER, or EMAIL_PASS)"
    );
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }

  const ownerEmail = resolveOwnerInbox();
  const from = process.env.MAIL_FROM || process.env.EMAIL_USER;
  const { text, html } = formatContactInquiryEmailBody(data);
  const subject = `Contact: ${data.subject} — ${data.fullName}`;

  await transporter.sendMail({
    from: `"KCC Classes" <${from}>`,
    to: ownerEmail,
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

module.exports = {
  getTransporter,
  sendRegistrationNotificationToOwner,
  sendContactInquiryToOwner,
};
