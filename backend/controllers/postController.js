const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    const image = req.file
      ? req.file.path
      : "";

    if (!text && !image) {
      return res.status(400).json({
        message: "Text or Image required",
      });
    }

    const currentUser =
      await User.findById(req.user.id);

    const newPost = new Post({
      user: req.user.id,

      username: req.user.username,

      avatar: currentUser.avatar,

      text,

      image,
    });

    await newPost.save();

    res.status(201).json({
      message:
        "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);

    const posts = await Post.find().sort({
      createdAt: -1,
    });

    console.log("Total posts:", posts.length);

    const currentUser = await User.findById(req.user.id)
      .select("savedPosts");

    const updatedPosts = posts.map((post) => {
      const postObj = post.toObject();

      postObj.isSaved =
        currentUser.savedPosts.some(
          (id) =>
            id.toString() === post._id.toString()
        );

      return postObj;
    });

    res.status(200).json(updatedPosts);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user.id
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      post.likes.push(req.user.id);

      // Create notification only if user likes someone else's post
      if (post.user.toString() !== req.user.id) {
        await Notification.create({
          receiver: post.user,
          sender: req.user.id,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Post unliked"
        : "Post liked",
      likesCount: post.likes.length,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      username: req.user.username,
      text,
    });

    await post.save();

    // Create notification only if commenting on someone else's post
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        receiver: post.user,
        sender: req.user.id,
        type: "comment",
        post: post._id,
      });
    }

    res.status(200).json({
      message: "Comment added successfully",
      comments: post.comments,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  console.log("DELETE ROUTE HIT");
  console.log("POST ID:", req.params.id);
  console.log("USER:", req.user);

  try {
    const post = await Post.findById(req.params.id);

    console.log("POST:", post);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:");
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
  deletePost,
};