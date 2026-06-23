const express = require("express");

const router = express.Router();

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
  likePost,
  addComment,
  deletePost,
} = require("../controllers/postController");

// Create Post
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createPost
);

// Get All Posts
router.get("/", getPosts);

// Like Post
router.post(
  "/:id/like",
  authMiddleware,
  likePost
);

// Comment Post
router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

// Delete Post
router.delete(
  "/:id",
  authMiddleware,
  deletePost
);

module.exports = router;