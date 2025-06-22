"use client"

import { FaBars, FaTimes, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  // If no user is logged in, don't show the navbar (they should be on login/signup page)
  if (!user) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0">
              <span className="text-xl font-bold text-green-600">WardWatch</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/home"
                className={`flex items-center text-gray-700 hover:bg-green-50 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/home" ? "bg-green-50 text-green-600" : ""
                }`}
              >
                <FaHome className="mr-1" />
                Home
              </Link>
              <Link
                to="/complaint"
                className={`text-gray-700 hover:bg-green-50 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/complaint" ? "bg-green-50 text-green-600" : ""
                }`}
              >
                File Complaint
              </Link>
              <Link
                to="/mycomplaints"
                className={`text-gray-700 hover:bg-green-50 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/mycomplaints" ? "bg-green-50 text-green-600" : ""
                }`}
              >
                My Complaints
              </Link>
              <Link
                to="/forum"
                className={`text-gray-700 hover:bg-green-50 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/forum" ? "bg-green-50 text-green-600" : ""
                }`}
              >
                Discussion Forum
              </Link>
              <Link
                to="/feedback"
                className={`text-gray-700 hover:bg-green-50 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/feedback" ? "bg-green-50 text-green-600" : ""
                }`}
              >
                Feedback
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <FaUser className="text-green-600" />
              <div>
                <span className="text-sm font-medium">Hi, {user.name}!</span>
                <div className="text-xs text-gray-500">{user.ward}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/home"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link
              to="/complaint"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              File Complaint
            </Link>
            <Link
              to="/mycomplaints"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              My Complaints
            </Link>
            <Link
              to="/forum"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              Discussion Forum
            </Link>
            <Link
              to="/feedback"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              Feedback
            </Link>

            {/* User info and logout for mobile */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center px-3 py-2 text-gray-700">
                <FaUser className="text-green-600 mr-2" />
                <div>
                  <div className="text-sm font-medium">Hi, {user.name}!</div>
                  <div className="text-xs text-gray-500">{user.ward}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

