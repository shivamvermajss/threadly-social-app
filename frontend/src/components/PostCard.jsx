import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaHeart,
  FaRegComment,
  FaTrash,
  FaShare,
  FaBookmark,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import API from "../services/api";
import EditPostModal from "./EditPostModal";

function PostCard({ post, fetchPosts }) {

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );
  const [comment, setComment] = useState("");

  const [loadingLike, setLoadingLike] =
    useState(false);
  const [liked, setLiked] = useState(
  post.likes?.includes(currentUser?.id)
);

const [likeCount, setLikeCount] =
  useState(post.likes.length);

const [animateLike, setAnimateLike] =
  useState(false);  


  const [loadingComment, setLoadingComment] =
    useState(false);

  const [loadingDelete, setLoadingDelete] =
    useState(false);

  const [loadingSave, setLoadingSave] =
    useState(false);

  const [saved, setSaved] = useState(
    post.isSaved || false
  );

  const [showEditModal, setShowEditModal] =
    useState(false);

  

  const isOwner =
    currentUser?.id === post.user;

  // ==========================
  // Like
  // ==========================
  const handleLike = async () => {
  if (loadingLike) return;

  try {
    setLoadingLike(true);

    setAnimateLike(true);

    setTimeout(() => {
      setAnimateLike(false);
    }, 300);

    const res = await API.post(
      `/posts/${post._id}/like`
    );

    if (res.data.message === "Post liked") {
      setLiked(true);
    } else {
      setLiked(false);
    }

    setLikeCount(res.data.likesCount);

  } catch (error) {

    console.log(error);

    toast.error("Failed to like post");

  } finally {

    setLoadingLike(false);

  }
};

  // ==========================
  // Comment
  // ==========================
  const handleComment = async () => {
    if (!comment.trim()) return;

    if (loadingComment) return;

    try {

      setLoadingComment(true);

      await API.post(
        `/posts/${post._id}/comment`,
        {
          text: comment,
        }
      );

      setComment("");

      fetchPosts();

      toast.success(
        "Comment added"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to comment"
      );

    } finally {

      setLoadingComment(false);

    }
  };


  const handleDeleteComment = async (
  commentId
) => {
  const confirmDelete =
    window.confirm(
      "Delete this comment?"
    );

  if (!confirmDelete) return;

  try {
    await API.delete(
      `/posts/${post._id}/comment/${commentId}`
    );

    toast.success(
      "Comment deleted successfully"
    );

    fetchPosts();

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to delete comment"
    );

  }
};

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async () => {
    const confirmDelete =
      window.confirm(
        "Delete this post?"
      );

    if (!confirmDelete) return;

    if (loadingDelete) return;

    try {

      setLoadingDelete(true);

      await API.delete(
        `/posts/${post._id}`
      );

      fetchPosts();

      toast.success(
        "Post deleted successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete post"
      );

    } finally {

      setLoadingDelete(false);

    }
  };

  // ==========================
  // Save
  // ==========================
  const handleSave = async () => {
    if (loadingSave) return;

    try {

      setLoadingSave(true);

      const res = await API.put(
        `/users/save/${post._id}`
      );

      setSaved(res.data.saved);

      toast.success(
        res.data.message
      );

      fetchPosts?.();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save post"
      );

    } finally {

      setLoadingSave(false);

    }
  };

  // ==========================
  // Share
  // ==========================
  const handleShare = async () => {

    const shareUrl =
      `${window.location.origin}/post/${post._id}`;

    try {

      if (navigator.share) {

        await navigator.share({
          title: "Threadly",
          text:
            post.text ||
            "Check out this post!",
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      toast.success(
        "Post link copied!"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to share post"
      );

    }
  };

  return (
    <>
      <div
        className="card mb-4 shadow-sm"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Header */}

        <div className="d-flex justify-content-between align-items-center p-3">

          <div className="d-flex align-items-center">

            {post.avatar ? (

              <img
                src={post.avatar}
                alt="avatar"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "2px solid #0d6efd",
                }}
              />

            ) : (

              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#0d6efd,#5fa8ff)",
                  color: "white",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  fontWeight:
                    "bold",
                  fontSize:
                    "22px",
                }}
              >
                {post.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

            )}

            <div className="ms-3">

              <Link
                to={`/profile/${post.username}`}
                className="text-decoration-none"
              >
                <h6 className="fw-bold mb-0">
                  {post.username}
                </h6>
              </Link>

              <small className="text-muted">
                @{post.username?.toLowerCase()} •{" "}
                {formatDistanceToNow(
                  new Date(
                    post.createdAt
                  ),
                  {
                    addSuffix: true,
                  }
                )}
              </small>

            </div>

          </div>

          {isOwner && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setShowEditModal(
                  true
                )
              }
            >
              <FaEdit />
            </button>
          )}

        </div>

        {/* Text */}

        {post.text && (
          <div className="px-3 pb-3">
            <p
              className="mb-0"
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              {post.text}
            </p>
          </div>
        )}

        {/* Image */}

                {post.image && (
          <div className="overflow-hidden">
            <img
              src={post.image}
              alt="post"
              className="img-fluid w-100"
              style={{
                maxHeight: "500px",
                objectFit: "cover",
                transition: ".3s",
              }}
            />
          </div>
        )}

        {/* Action Bar */}

        <div className="d-flex justify-content-around align-items-center p-3 border-top">

          <button
  onClick={handleLike}
  disabled={loadingLike}
  className="btn btn-light"
>
  <FaHeart
    className={`me-2 like-icon ${
      liked ? "liked" : ""
    } ${animateLike ? "pop" : ""}`}
  />

  {likeCount}
</button>

          <button className="btn btn-light">
            <FaRegComment className="text-primary me-2" />
            {post.comments.length}
          </button>

          <button
            onClick={handleShare}
            className="btn btn-light"
          >
            <FaShare className="me-2" />
            Share
          </button>

          <button
            onClick={handleSave}
            disabled={loadingSave}
            className="btn btn-light"
          >
            {loadingSave ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              <>
                <FaBookmark
                  className={
                    saved
                      ? "text-warning me-2"
                      : "me-2"
                  }
                />
                {saved
                  ? "Saved"
                  : "Save"}
              </>
            )}
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={loadingDelete}
              className="btn btn-light text-danger"
            >
              <FaTrash />
            </button>
          )}

        </div>

        {/* Comment Box */}

        <div className="p-3">

          <div className="input-group">

            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleComment}
              disabled={loadingComment}
              className="btn btn-primary"
            >
              {loadingComment
                ? "Posting..."
                : "Post"}
            </button>

          </div>

        </div>

        {/* Comments */}

        {post.comments.length > 0 && (

  <div className="px-3 pb-3">

    {post.comments.map((comment) => (

      <div
        key={comment._id}
        className="bg-light rounded-4 p-3 mb-2 d-flex justify-content-between align-items-start"
      >

        <div>

          <strong>
            {comment.username}
          </strong>

          <div>
            {comment.text}
          </div>

        </div>

        {comment.username ===
          currentUser?.username && (

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() =>
              handleDeleteComment(
                comment._id
              )
            }
          >
            <FaTimes />
          </button>

        )}

      </div>

    ))}

  </div>

)}

      </div>

      {/* ==========================
          Edit Modal
      ========================== */}

      <EditPostModal
        show={showEditModal}
        onClose={() =>
          setShowEditModal(false)
        }
        post={post}
        fetchPosts={fetchPosts}
      />

    </>
  );
}

export default PostCard;