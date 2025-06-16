const express = require("express")
const { check } = require("express-validator")
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  uploadImage,
} = require("../controllers/complaintController")
const { protect, authorize } = require("../middleware/authMiddleware")

const router = express.Router()

router.post(
  "/",
  protect,
  uploadImage, // Handle file upload
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
  ],
  createComplaint,
)

router.get("/my", protect, getMyComplaints)
router.get("/", protect, authorize("admin"), getAllComplaints)
router.put("/:id", protect, authorize("admin"), updateComplaintStatus)
router.delete("/:id", protect, deleteComplaint) // Allow users to delete their own complaints

module.exports = router

