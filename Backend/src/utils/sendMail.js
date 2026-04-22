import Brevo from "@getbrevo/brevo";
import nodemailer from "nodemailer";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_SECRET
);

export const sendMail = async ({ to, subject, htmlContent }) => {
  const recipientEmail = to?.trim().toLowerCase();
  if (!recipientEmail) {
    throw new Error("Recipient email is required to send mail");
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpSecure = (process.env.SMTP_SECURE || "").toLowerCase() === "true";
  const smtpFrom = process.env.SMTP_FROM?.trim();

  const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass);

  const email = {
    to: [{ email: recipientEmail }],
    sender: {
      name: "Your Own Shopping Store",
      email:
        process.env.BREVO_SENDER_EMAIL ||
        smtpFrom ||
        "aergia45@gmail.com",
    },
    subject,
    htmlContent,
  };

  try {
    if (smtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"${email.sender.name}" <${email.sender.email}>`,
        to: recipientEmail,
        subject,
        html: htmlContent,
      });

      console.log("SMTP email sent to:", recipientEmail);
      return;
    }

    const brevoApiKey = process.env.BREVO_SECRET;
    if (!brevoApiKey || brevoApiKey === "your-brevo-api-key") {
      throw new Error(
        "BREVO_SECRET is missing/invalid and SMTP is not configured in backend .env"
      );
    }

    await apiInstance.sendTransacEmail(email);
    console.log("Brevo email sent to:", recipientEmail);
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
};
