"use client"

import { useState, useEffect } from "react"
import { FaQuoteLeft, FaHandsHelping, FaRecycle, FaUsers, FaChartLine, FaExclamationTriangle } from "react-icons/fa"
import { GiTreeGrowth } from "react-icons/gi"
import Navbar from "../../components/Navbar"

const Home = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    recentComplaints: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchUserStats()
    }
  }, [])

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const complaints = data.complaints || []

        setStats({
          totalComplaints: complaints.length,
          resolvedComplaints: complaints.filter((c) => c.status === "Resolved").length,
          pendingComplaints: complaints.filter((c) => c.status === "Pending").length,
          recentComplaints: complaints.slice(0, 3),
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      {/* Welcome Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 mt-1">{user.ward} • Making your community better together</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                  <p className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.totalComplaints}</p>
                </div>
                <FaChartLine className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{loading ? "..." : stats.resolvedComplaints}</p>
                </div>
                <FaUsers className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{loading ? "..." : stats.pendingComplaints}</p>
                </div>
                <FaExclamationTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Complaints</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : stats.recentComplaints.length === 0 ? (
              <p className="text-gray-500">No complaints filed yet. Start by filing your first complaint!</p>
            ) : (
              <div className="space-y-3">
                {stats.recentComplaints.map((complaint) => (
                  <div key={complaint._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{complaint.title}</p>
                      <p className="text-sm text-gray-600">
                        {complaint.category} • {complaint.location}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : complaint.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : complaint.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Clean neighborhood"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">Together for a Cleaner Tomorrow</h1>
            <p className="text-xl md:text-2xl italic font-light">
              "Keeping our surroundings clean is not an option - it's our responsibility"
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Our Mission & Vision</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaHandsHelping className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To empower communities to maintain clean, safe, and sustainable neighborhoods through collaborative
                reporting, awareness, and civic engagement.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <GiTreeGrowth className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                A world where every citizen actively participates in creating and maintaining pristine living
                environments that foster health, happiness, and community pride.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start">
                <FaQuoteLeft className="text-yellow-400 text-2xl mr-4 mt-1" />
                <p className="text-lg italic text-gray-700">
                  "We won't have a society if we destroy the environment."
                  <span className="block font-medium mt-2">- Margaret Mead</span>
                </p>
              </div>

              <div className="flex items-start">
                <FaQuoteLeft className="text-green-400 text-2xl mr-4 mt-1" />
                <p className="text-lg italic text-gray-700">
                  "Cleanliness is next to godliness."
                  <span className="block font-medium mt-2">- John Wesley</span>
                </p>
              </div>

              <div className="flex items-start">
                <FaQuoteLeft className="text-blue-400 text-2xl mr-4 mt-1" />
                <p className="text-lg italic text-gray-700">
                  "The environment is where we all meet; where all have a mutual interest."
                  <span className="block font-medium mt-2">- Lady Bird Johnson</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRecycle className="text-4xl mb-4" />,
                title: "Sustainability",
                desc: "Promoting eco-friendly solutions for long-term community health",
              },
              {
                icon: <FaUsers className="text-4xl mb-4" />,
                title: "Community",
                desc: "Strengthening bonds through collective environmental action",
              },
              {
                icon: <FaHandsHelping className="text-4xl mb-4" />,
                title: "Responsibility",
                desc: "Encouraging personal accountability for shared spaces",
              },
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-blue-700 rounded-xl hover:bg-blue-800 transition-colors">
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
