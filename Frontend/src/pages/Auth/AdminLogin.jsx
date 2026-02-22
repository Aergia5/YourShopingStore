import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../store/slices/authSlice"

export default function AdminLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.auth)

  const ADMIN_EMAIL = "admin@example.com"
  const ADMIN_PASSWORD = "admin123"

  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const result = await dispatch(
        login({ emailOrPhone, password })
      ).unwrap()

      if (result.isDummy) {
        if (result.isAdminDemo) {
          localStorage.setItem("pendingEmail", emailOrPhone);
          localStorage.setItem("adminLogin", "true");
          return navigate("/verify-otp");
        }
        setMessage("Demo user credentials only. Use admin@example.com / admin123 for demo admin.")
        return;
      }

      if (result.otpRequired) {
        localStorage.setItem("pendingEmail", emailOrPhone)
        localStorage.setItem("adminLogin", "true")
        return navigate("/verify-otp")
      }

      if (result.role === "admin") {
        return navigate("/admin/dashboard")
      }

      setMessage("Access denied. Admin credentials required.")
    } catch (err) {
      console.error("Admin login error:", err)
      setMessage(err.response?.data?.message || "Invalid email or password")
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden font-[Inter] z-0">
      <video
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.35]"
        autoPlay
        loop
        muted
        playsInline
        src="https://res.cloudinary.com/djm65usjg/video/upload/v1763285155/login6_prwtwb.mp4"
      />

      <Link
        to="/welcome"
        className="absolute top-6 left-6 text-white text-lg font-semibold hover:underline z-20"
      >
        ← Back to Home
      </Link>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen justify-center items-center px-6 md:px-16">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm backdrop-blur-md bg-white/5 border border-white/20 p-8 rounded-xl shadow-xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2 text-amber-500">
              Admin Login
            </h2>
            <p className="text-sm text-white mb-2">
              Enter your admin credentials
            </p>
            <span className="inline-block text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              Two-step verification enabled
            </span>
            <div className="mb-4 p-2.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs">
              <strong>Demo Admin:</strong> {ADMIN_EMAIL} / {ADMIN_PASSWORD} (OTP: 222222)
            </div>
          </div>

          <input
            type="text"
            placeholder="Admin Email or Phone"
            className="border-b border-gray-300 mb-6 w-full p-2.5 bg-transparent focus:outline-none focus:border-amber-500 text-white placeholder-gray-400"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-300 mb-6 w-full p-2.5 bg-transparent focus:outline-none focus:border-amber-500 text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors duration-300 cursor-pointer disabled:opacity-70 font-medium"
          >
            {loading ? "Verifying..." : "Login as Admin"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Regular user?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline text-white"
              onClick={() => navigate("/login")}
            >
              User Login
            </span>
          </p>

          {(message || error) && (
            <p className="text-center mt-4 text-sm text-red-400">
              {message || error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
