// const Discussion = require("../models/Discussion")

// // @desc    Get all discussions
// // @route   GET /api/discussions
// // @access  Private
// exports.getDiscussions = async (req, res) => {
//   try {
//     const discussions = await Discussion.find().populate("user", "name ward").sort({ createdAt: 1 }).limit(100)

//     res.status(200).json({
//       success: true,
//       discussions,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

// // @desc    Create new discussion message
// // @route   POST /api/discussions
// // @access  Private
// exports.createDiscussion = async (req, res) => {
//   try {
//     const { message } = req.body

//     if (!message || message.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Please provide a message",
//       })
//     }

//     const discussion = await Discussion.create({
//       message: message.trim(),
//       user: req.user.id,
//     })

//     await discussion.populate("user", "name ward")

//     res.status(201).json({
//       success: true,
//       discussion,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

const Discussion = require("../models/Discussion")

// @desc    Get all discussions with pagination
// @route   GET /api/discussions
// @access  Private
exports.getDiscussions = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const discussions = await Discussion.find()
      .populate("user", "name ward")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Discussion.countDocuments()

    res.status(200).json({
      success: true,
      discussions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Create new discussion message
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
  try {
    const { message, language } = req.body

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a message",
      })
    }

    const discussion = await Discussion.create({
      message: message.trim(),
      language: language || "en",
      user: req.user.id,
    })

    await discussion.populate("user", "name ward")

    res.status(201).json({
      success: true,
      discussion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Delete discussion message
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found",
      })
    }

    // Check if user owns the discussion or is admin
    if (discussion.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this message",
      })
    }

    await Discussion.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// @desc    Like/Unlike a discussion
// @route   PUT /api/discussions/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found",
      })
    }

    const userId = req.user.id
    const likeIndex = discussion.likes.indexOf(userId)

    if (likeIndex > -1) {
      // Unlike
      discussion.likes.splice(likeIndex, 1)
    } else {
      // Like
      discussion.likes.push(userId)
    }

    await discussion.save()
    await discussion.populate("user", "name ward")

    res.status(200).json({
      success: true,
      discussion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

