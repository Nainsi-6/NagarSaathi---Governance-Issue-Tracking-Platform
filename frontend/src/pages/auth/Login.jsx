"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaLock } from "react-icons/fa"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import toast from "react-hot-toast"

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    isAdmin: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const toggleLoginType = () => {
    setCredentials((prev) => ({
      ...prev,
      isAdmin: !prev.isAdmin,
      username: "",
      password: "",
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (credentials.isAdmin) {
        response = await fetch("http://localhost:5000/api/auth/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        })
      } else {
        response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.username,
            password: credentials.password,
          }),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Save user data and token to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success(`Welcome back, ${data.user.name}!`)

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/home")
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/google/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId: credentialResponse.credential,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Google login failed")
      }

      // Save user data and token to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success(`Welcome, ${data.user.name}!`)
      navigate("/home")
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.")
    toast.error("Google authentication failed")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className={`py-6 px-8 text-center ${credentials.isAdmin ? "bg-red-600" : "bg-indigo-600"}`}>
          <h1 className="text-3xl font-bold text-white">{credentials.isAdmin ? "Admin Login" : "User Login"}</h1>
          <p className="text-indigo-100 mt-2">
            {credentials.isAdmin ? "Restricted Access" : "Welcome back to WardWatch"}
          </p>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">{credentials.isAdmin ? "Admin Username" : "Email"}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-indigo-500"
                  placeholder={credentials.isAdmin ? "Enter admin username" : "Your email"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-indigo-500"
                  placeholder="Your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg transition duration-200 font-medium ${
                loading
                  ? "bg-gray-400"
                  : credentials.isAdmin
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {loading ? "Authenticating..." : credentials.isAdmin ? "Login as Admin" : "Login as User"}
            </button>
          </form>

          {!credentials.isAdmin && (
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
           <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "975353904586-j0e5mnsvg4lcivnptse9cupaaock8p40.apps.googleusercontent.com"}>


                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      shape="pill"
                      width="100%"
                      text="continue_with"
                      size="large"
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>
            </div>
          )}

          <div className="mt-6 text-center space-y-3">
            <button onClick={toggleLoginType} className="text-indigo-600 hover:text-indigo-800 font-medium">
              {credentials.isAdmin ? "← Login as regular user" : "Login as admin →"}
            </button>

            {!credentials.isAdmin && (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
