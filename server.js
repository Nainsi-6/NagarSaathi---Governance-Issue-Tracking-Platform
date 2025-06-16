// const express = require("express")
// const dotenv = require("dotenv")
// const morgan = require("morgan")
// const colors = require("colors")
// const cors = require("cors")
// const cookieParser = require("cookie-parser")
// const connectDB = require("./config/db")

// // Load env vars
// dotenv.config({ path: "./.env" })

// // Connect to database
// connectDB()

// // Route files
// const auth = require("./routes/authRoutes")
// const complaints = require("./routes/complaintRoutes")
// const discussions = require("./routes/discussionRoutes")

// const app = express()

// // Body parser
// app.use(express.json())

// // Cookie parser
// app.use(cookieParser())

// // Dev logging middleware
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"))
// }

// // Enable CORS
// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// )

// // Mount routers
// app.use("/api/auth", auth)
// app.use("/api/complaints", complaints)
// app.use("/api/discussions", discussions)

// const PORT = process.env.PORT || 5000

// const server = app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold),
// )

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`.red)
//   server.close(() => process.exit(1))
// })

const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const fs = require("fs")
const connectDB = require("./config/db")
const multer = require("multer") // Import multer

// Load env vars
dotenv.config({ path: "./.env" })

// Connect to database
connectDB()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads", "complaints")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Route files
const auth = require("./routes/authRoutes")
const complaints = require("./routes/complaintRoutes")
const discussions = require("./routes/discussionRoutes")

const app = express()

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Cookie parser
app.use(cookieParser())

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

// Mount routers
app.use("/api/auth", auth)
app.use("/api/complaints", complaints)
app.use("/api/discussions", discussions)

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB.",
      })
    }
  }

  res.status(500).json({
    success: false,
    error: error.message || "Server Error",
  })
})

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold),
)

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})

