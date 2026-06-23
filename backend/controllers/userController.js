const Post = require("../models/Post");

const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const posts = await Post.find({
      username,
    }).sort({ createdAt: -1 });

    const totalLikes = posts.reduce(
      (total, post) =>
        total + post.likes.length,
      0
    );

    res.json({
      username,
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

module.exports = {
  getUserProfile,
};