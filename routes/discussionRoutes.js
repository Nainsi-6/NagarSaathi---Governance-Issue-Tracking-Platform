const express = require("express")
const {
  getDiscussions,
  createDiscussion,
  deleteDiscussion,
  toggleLike,
} = require("../controllers/discussionController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", protect, getDiscussions)
router.post("/", protect, createDiscussion)
router.delete("/:id", protect, deleteDiscussion)
router.put("/:id/like", protect, toggleLike)

module.exports = router

