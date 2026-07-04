import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function CreatePost({ fetchPosts }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim() && !image) {
      toast.error("Please add text or image");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setText("");
      setImage(null);
      setPreview(null);

      toast.success("Post Created Successfully 🚀");

      fetchPosts();

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create post"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "18px",
      }}
    >
      <h5 className="fw-bold mb-3">
        Create Post
      </h5>

      <textarea
        className="form-control mb-3"
        placeholder="What's on your mind?"
        rows="4"
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
      />

      <input
        type="file"
        className="form-control mb-3"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];

          setImage(file);

          if (file) {
            setPreview(
              URL.createObjectURL(file)
            );
          } else {
            setPreview(null);
          }
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="img-fluid rounded mb-3"
          style={{
            maxHeight: "250px",
            width: "100%",
            objectFit: "cover",
          }}
        />
      )}

      <button
        onClick={handlePost}
        disabled={loading}
        className="btn btn-primary w-100"
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Posting...
          </>
        ) : (
          "Create Post"
        )}
      </button>
    </div>
  );
}

export default CreatePost;