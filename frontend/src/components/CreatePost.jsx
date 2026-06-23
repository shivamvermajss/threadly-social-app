import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function CreatePost({ fetchPosts }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePost = async () => {
    if (!text.trim() && !image) {
      toast.error(
        "Please add text or image"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      await API.post(
        "/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setText("");
      setImage(null);
      setPreview(null);

      toast.success(
        "Post Created Successfully 🚀"
      );

      fetchPosts();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to create post"
      );
    }
  };

  return (
    <div
      className="card p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "18px",
      }}
    >
      <h5 className="mb-3">
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
        className="btn btn-primary w-100"
      >
        Create Post
      </button>
    </div>
  );
}

export default CreatePost;