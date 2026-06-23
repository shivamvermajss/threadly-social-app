import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import API from "../services/api";

function PostCard({ post, fetchPosts }) {
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

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
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");

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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(
        `/posts/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();

      alert("Post Deleted Successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  return (
    <div
      className="card p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "18px",
        border: "none",
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center mb-3">

        {post.avatar ? (
          <img
            src={post.avatar}
            alt="avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "12px",
              border: "2px solid #0d6efd",
            }}
          />
        ) : (
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#0d6efd",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "20px",
              marginRight: "12px",
            }}
          >
            {post.username?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <Link
            to={`/profile/${post.username}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h6 className="mb-0">
              {post.username}
            </h6>
          </Link>

          <small className="text-muted">
            @{post.username?.toLowerCase()}
          </small>

          <br />

          <small className="text-muted">
            {formatDistanceToNow(
              new Date(post.createdAt),
              {
                addSuffix: true,
              }
            )}
          </small>
        </div>
      </div>

      {/* Post Text */}
      {post.text && (
        <p className="mb-3">
          {post.text}
        </p>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="img-fluid rounded mb-3"
          style={{
            maxHeight: "450px",
            width: "100%",
            objectFit: "cover",
          }}
        />
      )}

      <hr />

      {/* Actions */}
      <div className="d-flex justify-content-between mb-3">
        <button
          onClick={handleLike}
          className="btn btn-outline-danger"
        >
          ❤️ Like ({post.likes.length})
        </button>

        <button className="btn btn-outline-primary">
          💬 Comments ({post.comments.length})
        </button>

        <button
          onClick={handleDelete}
          className="btn btn-outline-dark"
        >
          🗑 Delete
        </button>
      </div>

      {/* Comment Input */}
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          onClick={handleComment}
          className="btn btn-primary"
        >
          Add
        </button>
      </div>

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="mt-3">
          {post.comments.map(
            (comment, index) => (
              <div
                key={index}
                className="bg-light rounded p-2 mb-2"
              >
                <strong>
                  {comment.username}
                </strong>

                <p className="mb-0">
                  {comment.text}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;