const express = require("express");

const router = express.Router();

// Test Route
router.delete("/test", (req, res) => {
  console.log("TEST DELETE HIT");

  res.status(200).json({
    success: true,
  });
});

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  likePost,
  addComment,
  deleteComment,
  deletePost,
} = require("../controllers/postController");

// ===============================
// Create Post
// ===============================
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createPost
);

// ===============================
// Get All Posts
// ===============================
router.get(
  "/",
  authMiddleware,
  getPosts
);

// ===============================
// Get Single Post
// ===============================
router.get(
  "/:id",
  authMiddleware,
  getSinglePost
);

// ===============================
// Like / Unlike Post
// ===============================
router.post(
  "/:id/like",
  authMiddleware,
  likePost
);

// ===============================
// Add Comment
// ===============================
router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

// Delete Comment
router.delete(
  "/:postId/comment/:commentId",
  authMiddleware,
  deleteComment
);

// ===============================
// Update Post
// ===============================
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updatePost
);

// ===============================
// Delete Post
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  deletePost
);



module.exports = router;