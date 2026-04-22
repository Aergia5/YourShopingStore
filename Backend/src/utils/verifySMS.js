import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const cleanEnv = (value) =>
  String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

export const verifySMS = async (phone, otp) => {
  try {
    const accountSid = cleanEnv(process.env.TWILIO_ACCOUNT_SID);
    const authToken = cleanEnv(process.env.TWILIO_AUTH_TOKEN);
    const verifyServiceSid = cleanEnv(process.env.TWILIO_VERIFY_SERVICE_SID);
    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error("Twilio Verify OTP Error: Missing Twilio env configuration");
      return false;
    }
    if (!accountSid.startsWith("AC") || !verifyServiceSid.startsWith("VA")) {
      console.error("Twilio Verify OTP Error: Invalid Twilio SID format");
      return false;
    }

    const client = twilio(accountSid, authToken);
    const to = phone.startsWith("+") ? phone : `+977${phone}`;
    const check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to, code: otp });

    return check.status === "approved";
  } catch (err) {
    console.error("Twilio Verify OTP Error:", err?.message || err);
    return false;
  }
};
