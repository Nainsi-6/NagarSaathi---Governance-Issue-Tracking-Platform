"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import Navbar from "../../components/Navbar"

const Feedback = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      // Pre-fill form with user data
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }))
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRating = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send to your backend
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitSuccess(true)
      setFormData((prev) => ({
        ...prev,
        message: "",
        rating: 0,
      }))

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      alert("Error submitting feedback: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <Navbar />

      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">We Value Your Feedback</h2>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              Thank you for your feedback! We appreciate your input.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you think..."
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              ></textarea>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button type="button" key={val} onClick={() => handleRating(val)} className="focus:outline-none">
                    <Star
                      size={32}
                      className={`transition ${
                        val <= formData.rating
                          ? "text-yellow-500 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">
                  {formData.rating > 0 ? `${formData.rating}/5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || formData.rating === 0}
                className={`w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all flex items-center justify-center ${
                  isSubmitting ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Feedback
