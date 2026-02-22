import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../store/slices/authSlice"


export default function Login() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector(state => state.auth)

  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const DUMMY_EMAIL = "demo@example.com"
  const DUMMY_PASSWORD = "123456"
  const ADMIN_EMAIL = "admin@example.com"
  const ADMIN_PASSWORD = "admin123"

  useEffect(() => {
    setEmailOrPhone(DUMMY_EMAIL)
    setPassword(DUMMY_PASSWORD)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
  
    
    try {
      const result = await dispatch(
        login({ emailOrPhone, password })
      ).unwrap()

      if (result.isDummy) {
        localStorage.setItem("isDummy", "true")
        localStorage.setItem("dummyOtp", result.dummyOtp)
        localStorage.setItem("pendingEmail", result.isAdminDemo ? ADMIN_EMAIL : emailOrPhone)
        if (result.isAdminDemo) localStorage.setItem("adminLogin", "true")
        return navigate("/verify-otp")
      }
  
      if (result.otpRequired) {
        localStorage.setItem("pendingEmail", emailOrPhone)
        return navigate("/verify-otp")
      }
      navigate(result.role === "admin" ? "/admin/dashboard" : "/products")
    } catch (err) {
      console.error("Login error:", err)
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
            <h2 className="text-3xl font-semibold mb-2 text-green-600">
              Login
            </h2>
            <p className="text-sm text-white mb-2">
              Enter your credentials to continue
            </p>
            <span className="inline-block text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30">
              Two-step verification enabled
            </span>
          </div>

          <div className="mb-4 space-y-2">
            <div className="p-2.5 rounded-md bg-yellow-500/20 border border-yellow-300/30 text-yellow-200 text-xs">
              <strong>Demo User:</strong> {DUMMY_EMAIL} / {DUMMY_PASSWORD} (OTP: 111111)
            </div>
            <div className="p-2.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs">
              <strong>Demo Admin:</strong> {ADMIN_EMAIL} / {ADMIN_PASSWORD} (OTP: 222222)
            </div>
          </div>

          <input
            type="text"
            placeholder="Email or Phone"
            className="border-b border-gray-300 mb-6 w-full p-2.5 bg-transparent focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-300 mb-6 w-full p-2.5 bg-transparent focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 cursor-pointer disabled:opacity-70 font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            Admin?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline text-amber-400"
              onClick={() => navigate("/admin/login")}
            >
              Admin Login
            </span>
          </p>

          <p className="text-center text-sm text-gray-400 mt-2">
            New user?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline text-white"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>

          {(message || error) && (
            <p className="text-center mt-4 text-sm text-red-500">
              {message || error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}