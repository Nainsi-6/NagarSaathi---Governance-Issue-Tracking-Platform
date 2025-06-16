// const Complaint = require("../models/Complaint")
// const { validationResult } = require("express-validator")

// // @desc    Create new complaint
// // @route   POST /api/complaints
// // @access  Private
// exports.createComplaint = async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() })
//     }

//     const { title, description, category, location } = req.body

//     const complaint = await Complaint.create({
//       title,
//       description,
//       category,
//       location,
//       user: req.user.id,
//     })

//     await complaint.populate("user", "name email ward")

//     res.status(201).json({
//       success: true,
//       complaint,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

// // @desc    Get all complaints for logged in user
// // @route   GET /api/complaints/my
// // @access  Private
// exports.getMyComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ user: req.user.id })
//       .populate("user", "name email ward")
//       .sort({ createdAt: -1 })

//     res.status(200).json({
//       success: true,
//       count: complaints.length,
//       complaints,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

// // @desc    Get all complaints (Admin only)
// // @route   GET /api/complaints
// // @access  Private/Admin
// exports.getAllComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find().populate("user", "name email ward").sort({ createdAt: -1 })

//     res.status(200).json({
//       success: true,
//       count: complaints.length,
//       complaints,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

// // @desc    Update complaint status (Admin only)
// // @route   PUT /api/complaints/:id
// // @access  Private/Admin
// exports.updateComplaintStatus = async (req, res) => {
//   try {
//     const { status } = req.body

//     const complaint = await Complaint.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         resolvedAt: status === "Resolved" ? new Date() : undefined,
//       },
//       { new: true, runValidators: true },
//     ).populate("user", "name email ward")

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         error: "Complaint not found",
//       })
//     }

//     res.status(200).json({
//       success: true,
//       complaint,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

const Complaint = require("../models/Complaint")
const { validationResult } = require("express-validator")
const multer = require("multer")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/complaints/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, category, location, priority } = req.body

    const complaintData = {
      title,
      description,
      category,
      location,
      priority: priority || "Medium",
      user: req.user.id,
    }

    // Add image path if file was uploaded
    if (req.file) {
      complaintData.image = req.file.path
    }

    const complaint = await Complaint.create(complaintData)
    await complaint.populate("user", "name email ward")

    res.status(201).json({
      success: true,
      complaint,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Get all complaints for logged in user
// @route   GET /api/complaints/my
// @access  Private
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("user", "name email ward")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Delete complaint (User can delete their own)
// @route   DELETE /api/complaints/:id
// @access  Private
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      })
    }

    // Check if user owns the complaint or is admin
    if (complaint.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this complaint",
      })
    }

    await Complaint.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private/Admin
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email ward").sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private/Admin
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolvedAt: status === "Resolved" ? new Date() : undefined,
      },
      { new: true, runValidators: true },
    ).populate("user", "name email ward")

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      })
    }

    res.status(200).json({
      success: true,
      complaint,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// Export multer upload middleware
exports.uploadImage = upload.single("image")
