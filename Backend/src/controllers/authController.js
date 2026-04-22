import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail.js";
import { sendSMS } from "../utils/sendSMS.js";
import { verifySMS } from "../utils/verifySMS.js";
import { otpTemplate, resetTemplate } from "../utils/emailTemplates.js";

dotenv.config();


function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}


export const register = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.trim();
    if (!normalizedEmail || !password || !normalizedPhone) {
      return res.status(400).json({ message: "Email, phone & password are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
    });
    if (existing) {
      return res.status(409).json({ message: "User already exists with this email or phone" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });
    // Two-step verification: send OTP to verify phone
    const sessionId = await sendSMS(normalizedPhone);
    if (!sessionId) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    newUser.otpSessionId = sessionId;
    newUser.otp = null;
    newUser.otpExpiry = null;
    await newUser.save();

    res.status(201).json({
      message: "Check your phone for verification code",
      requiresVerification: true,
      emailOrPhone: newUser.phone,
    });
  } catch (err) {
    console.error("Register error:", err);
    const brevoCode = err?.response?.data?.code;
    const brevoAuthError =
      err?.message?.includes("BREVO_SECRET is missing or invalid") ||
      brevoCode === "unauthorized";
    if (brevoAuthError) {
      return res.status(500).json({
        message:
          "Email service is not configured. Please set a valid BREVO_SECRET in backend .env",
      });
    }
    if (brevoCode === "permission_denied") {
      return res.status(503).json({
        message:
          "Email sending is blocked by Brevo: SMTP/Transactional email is not activated for this account yet. Activate it in Brevo (or contact Brevo support), then try again.",
      });
    }
    if (err?.message?.includes("SMTP is not configured")) {
      return res.status(503).json({
        message:
          "Email is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended) or a valid BREVO_SECRET, then restart the backend.",
      });
    }
    if (err?.code === "EAUTH" || err?.responseCode === 535) {
      return res.status(503).json({
        message:
          "SMTP login failed (Gmail rejected the username/app-password). Verify SMTP_USER matches the Gmail account that generated the App Password, then set SMTP_PASS to the current App Password and restart backend.",
      });
    }
    if (err?.code === "ERR_BAD_REQUEST") {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (emailOrPhone === "demo@example.com" && password === "123456") {
      return res.json({
        otpRequired: true,
        isDummy: true,
        dummyOtp: "111111"
      });
    }
    if (emailOrPhone === "admin@example.com" && password === "admin123") {
      return res.json({
        otpRequired: true,
        isDummy: true,
        dummyOtp: "222222",
        isAdminDemo: true
      });
    }
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Wrong password" });
    if (!emailOrPhone.includes("@")) {
      const sessionId = await sendSMS(user.phone);
      if (!sessionId)
        return res.status(500).json({ message: "Failed to send OTP" });
      user.otpSessionId = sessionId;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.json({
        otpRequired: true,
        message: "OTP sent via SMS",
      });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otpSessionId = null;
    await user.save();
    await sendMail({
      to: user.email,
      subject: "Your Login OTP",
      htmlContent: otpTemplate(otp),
    });
    res.json({ otpRequired: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Login error:", err);
    const brevoCode = err?.response?.data?.code;
    if (brevoCode === "permission_denied") {
      return res.status(503).json({
        message:
          "Email sending is blocked by Brevo: SMTP/Transactional email is not activated for this account yet. Activate it in Brevo (or contact Brevo support), then try again.",
      });
    }
    if (err?.message?.includes("SMTP is not configured")) {
      return res.status(503).json({
        message:
          "Email is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended) or a valid BREVO_SECRET, then restart the backend.",
      });
    }
    if (err?.code === "EAUTH" || err?.responseCode === 535) {
      return res.status(503).json({
        message:
          "SMTP login failed (Gmail rejected the username/app-password). Verify SMTP_USER matches the Gmail account that generated the App Password, then set SMTP_PASS to the current App Password and restart backend.",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    })
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    let valid = false;
    if (!emailOrPhone.includes("@")) {
      valid = await verifySMS(user.otpSessionId, otp);
    }
    else {
      valid = user.otp === otp && new Date() < new Date(user.otpExpiry);
    }
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpSessionId = null;
    user.otpExpiry = null;
    await user.save();
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
// console.log(process.env.FRONTEND_URL);
export const resendOtp = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!emailOrPhone.includes("@")) {
      const sessionId = await sendSMS(user.phone);
      if (!sessionId)
        return res.status(500).json({ message: "Failed to resend OTP" });
      user.otpSessionId = sessionId;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.json({ message: "OTP resent via SMS" });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otpSessionId = null;
    await user.save();
    await sendMail({
      to: user.email,
      subject: "Your OTP Code",
      htmlContent: otpTemplate(otp),
    });
    res.json({ message: "OTP resent to email" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    const brevoCode = err?.response?.data?.code;
    if (brevoCode === "permission_denied") {
      return res.status(503).json({
        message:
          "Email sending is blocked by Brevo: SMTP/Transactional email is not activated for this account yet. Activate it in Brevo (or contact Brevo support), then try again.",
      });
    }
    if (err?.message?.includes("SMTP is not configured")) {
      return res.status(503).json({
        message:
          "Email is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended) or a valid BREVO_SECRET, then restart the backend.",
      });
    }
    if (err?.code === "EAUTH" || err?.responseCode === 535) {
      return res.status(503).json({
        message:
          "SMTP login failed (Gmail rejected the username/app-password). Verify SMTP_USER matches the Gmail account that generated the App Password, then set SMTP_PASS to the current App Password and restart backend.",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });    
    if (!user) return res.status(404).json({ message: "User not found" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    // Always send reset link via email (user has email regardless of lookup method)
    await sendMail({
      to: user.email,
      subject: "Reset your password - Your Shopping Store",
      htmlContent: resetTemplate(resetURL),
    });
    // For phone-only lookup, 2Factor API doesn't support custom SMS - user gets email
    res.json({ message: "Password reset link sent to your email" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });

    if (
      !user ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: err.message });
  }
};
