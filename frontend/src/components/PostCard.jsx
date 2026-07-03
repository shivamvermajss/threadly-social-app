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
} from "react-icons/fa";
import API from "../services/api";

function PostCard({ post, fetchPosts }) {
  const [comment, setComment] = useState("");

  const [loadingLike, setLoadingLike] =
    useState(false);

  const [loadingComment, setLoadingComment] =
    useState(false);
  
  const [saved, setSaved] =
  useState(post.isSaved || false);

  const [loadingSave, setLoadingSave] =
  useState(false);  

  const [loadingDelete, setLoadingDelete] =
    useState(false);

  const handleLike = async () => {
    if (loadingLike) return;

    try {
      setLoadingLike(true);

      const token =
        localStorage.getItem("token");

      await API.post(
        `/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();

    } catch (error) {
      console.log(error);

      toast.error("Failed to like post");

    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    if (loadingComment) return;

    try {
      setLoadingComment(true);

      const token =
        localStorage.getItem("token");

      await API.post(
        `/posts/${post._id}/comment`,
        {
          text: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");

      fetchPosts();

      toast.success("Comment added");

    } catch (error) {
      console.log(error);

      toast.error("Failed to comment");

    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    if (loadingDelete) return;

    try {
      setLoadingDelete(true);

      const token =
        localStorage.getItem("token");

      await API.delete(
        `/posts/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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


  const handleSave = async () => {
  if (loadingSave) return;

  try {
    setLoadingSave(true);

    const res = await API.put(
      `/users/save/${post._id}`
    );

    setSaved(res.data.saved);

    toast.success(res.data.message);

    // Refresh the current page if a callback was provided
    if (fetchPosts) {
      fetchPosts();
    }

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

  return (
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
                border: "2px solid #0d6efd",
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
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "22px",
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
                new Date(post.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </small>

          </div>

        </div>

        <button className="btn btn-sm">
          ⋮
        </button>

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
            className="text-danger me-2"
          />

          {post.likes.length}
        </button>

        <button
          className="btn btn-light"
        >
          <FaRegComment
            className="text-primary me-2"
          />

          {post.comments.length}
        </button>

        <button
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
      <span
        className="spinner-border spinner-border-sm me-2"
      ></span>
      Please wait...
    </>
  ) : (
    <>
      <FaBookmark
        className={
          saved ? "text-warning me-2" : "me-2"
        }
      />
      {saved ? "Saved" : "Save"}
    </>
  )}
</button>

        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          className="btn btn-light text-danger"
        >
          <FaTrash />
        </button>

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
            Post
          </button>

        </div>

      </div>

      {/* Comments */}

      {post.comments.length > 0 && (

        <div className="px-3 pb-3">

          {post.comments.map(
            (comment, index) => (

              <div
                key={index}
                className="bg-light rounded-4 p-3 mb-2"
              >
                <strong>
                  {comment.username}
                </strong>

                <div>
                  {comment.text}
                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default PostCard;