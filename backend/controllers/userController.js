const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ===============================
// Get Public User Profile
// ===============================
const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const posts = await Post.find({
      username,
    }).sort({ createdAt: -1 });

    const user = await User.findOne({
      username,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalLikes = posts.reduce(
      (total, post) => total + post.likes.length,
      0
    );

    res.json({
      userId: user._id,

      username: user.username,

      createdAt: user.createdAt,

      bio: user.bio || "",

      avatar: user.avatar || "",

      coverImage: user.coverImage || "",

      website: user.website || "",

      location: user.location || "",

      followers: user.followers.length,

      following: user.following.length,

      followersList: user.followers,

      followingList: user.following,

      totalPosts: posts.length,

      totalLikes,

      posts,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Get Logged-in User Profile
// ===============================
const getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ===============================
// Update Profile
// ===============================
const updateProfile = async (req, res) => {
  try {

    const {
      username,
      bio,
      website,
      location,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (website) user.website = website;
    if (location) user.location = location;

    if (req.files?.avatar) {
      user.avatar = req.files.avatar[0].path;
    }

    if (req.files?.coverImage) {
      user.coverImage =
        req.files.coverImage[0].path;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ===============================
// Follow / Unfollow User
// ===============================
// ===============================
// Follow / Unfollow User
// ===============================
const followUser = async (req, res) => {
  try {

    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId
    );

    // ===============================
    // UNFOLLOW
    // ===============================
    if (isFollowing) {

      currentUser.following =
        currentUser.following.filter(
          (id) => id.toString() !== targetUserId
        );

      targetUser.followers =
        targetUser.followers.filter(
          (id) => id.toString() !== currentUserId
        );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "Unfollowed Successfully",
        following: false,
        followersCount: targetUser.followers.length,
      });
    }

    // ===============================
    // FOLLOW
    // ===============================
    currentUser.following.push(targetUserId);

    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    // ===============================
    // CREATE NOTIFICATION
    // ===============================
    await Notification.create({
      receiver: targetUserId,
      sender: currentUserId,
      type: "follow",
    });

    res.status(200).json({
      message: "Followed Successfully",
      following: true,
      followersCount: targetUser.followers.length,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ===============================
// Search Users
// ===============================
const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
    })
      .select(
        "username avatar bio followers"
      )
      .limit(10);

    res.status(200).json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// ===============================
// Save / Unsave Post
// ===============================
const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const postId = req.params.postId;

    const alreadySaved = user.savedPosts.some(
      (id) => id.toString() === postId
    );

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId
      );

      await user.save();

      return res.status(200).json({
        message: "Post removed from Saved",
        saved: false,
      });
    }

    user.savedPosts.push(postId);

    await user.save();

    res.status(200).json({
      message: "Post Saved Successfully",
      saved: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ===============================
// Get Saved Posts
// ===============================
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedPosts",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });

    res.status(200).json(user.savedPosts);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getUserProfile,
  getMyProfile,
  updateProfile,
  followUser,
  searchUsers,
  savePost,
  getSavedPosts,
};