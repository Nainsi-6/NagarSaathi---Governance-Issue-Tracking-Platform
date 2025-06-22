"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"

const statusStyles = {
  Pending: "bg-yellow-200 text-yellow-800",
  "In Progress": "bg-blue-200 text-blue-800",
  Resolved: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
}

const MyComplaints = () => {
  const [user, setUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchComplaints()
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data.complaints || [])
      } else {
        console.error("Failed to fetch complaints")
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setComplaints(complaints.filter((complaint) => complaint._id !== id))
        setShowDeleteConfirm(null)
        alert("Complaint deleted successfully")
      } else {
        alert("Failed to delete complaint")
      }
    } catch (error) {
      console.error("Error deleting complaint:", error)
      alert("Error deleting complaint")
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              <span className="text-indigo-600 font-bold text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <div className="flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">{user.ward}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6">My Complaints</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading complaints...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {complaints.length === 0 ? (
                <p className="text-center text-gray-500">No complaints filed yet.</p>
              ) : (
                complaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 relative"
                  >
                    {showDeleteConfirm === complaint._id ? (
                      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border">
                        <p className="text-sm mb-2">Delete this complaint?</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(complaint._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(complaint._id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                        title="Delete complaint"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}

                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{complaint.title}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusStyles[complaint.status] || "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{complaint.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Category: {complaint.category}</span>
                      <span>Priority: {complaint.priority}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Location: {complaint.location}</span>
                      <span>Ward: {user.ward}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Date Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyComplaints
