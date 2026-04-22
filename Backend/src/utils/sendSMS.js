import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const cleanEnv = (value) =>
  String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

export const sendSMS = async (phone) => {
  try {
    const accountSid = cleanEnv(process.env.TWILIO_ACCOUNT_SID);
    const authToken = cleanEnv(process.env.TWILIO_AUTH_TOKEN);
    const verifyServiceSid = cleanEnv(process.env.TWILIO_VERIFY_SERVICE_SID);

    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error("Twilio SMS Error: Missing Twilio env configuration");
      return null;
    }
    if (!accountSid.startsWith("AC")) {
      console.error("Twilio SMS Error: TWILIO_ACCOUNT_SID must start with AC");
      return null;
    }
    if (!verifyServiceSid.startsWith("VA")) {
      console.error("Twilio SMS Error: TWILIO_VERIFY_SERVICE_SID must start with VA");
      return null;
    }

    const client = twilio(accountSid, authToken);
    const to = phone.startsWith("+") ? phone : `+977${phone}`;
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to, channel: "sms" });

    if (verification.status !== "pending") return null;

    return to; // use phone as verification key
  } catch (err) {
    console.error("Twilio Send SMS Error:", err?.message || err);
    return null;
  }
};
