const express = require("express");

const router = express.Router();

const {
  getUserProfile,
  getMyProfile,
  updateProfile,
  followUser,
  searchUsers,
  savePost,
  getSavedPosts,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// ===============================
// Logged-in User Profile
// ===============================
router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

// ===============================
// Update Profile
// ===============================
router.put(
  "/profile",
  authMiddleware,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateProfile
);

// ===============================
// Follow / Unfollow User
// ===============================
router.put(
  "/follow/:id",
  authMiddleware,
  followUser
);

// ===============================
// Save / Unsave Post
// ===============================
router.put(
  "/save/:postId",
  authMiddleware,
  savePost
);

// ===============================
// Get Saved Posts
// ===============================
router.get(
  "/saved",
  authMiddleware,
  getSavedPosts
);

// ===============================
// Search Users
// IMPORTANT: Keep this above /:username
// ===============================
router.get(
  "/search/users",
  authMiddleware,
  searchUsers
);

// ===============================
// Public Profile
// ===============================
router.get(
  "/:username",
  getUserProfile
);

module.exports = router;