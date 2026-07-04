import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function EditPostModal({
  show,
  onClose,
  post,
  fetchPosts,
}) {
  const [text, setText] = useState("");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
  if (show && post) {
    setText(post.text || "");
    setPreview(post.image || "");
    setImage(null);
  }
}, [show, post]);

  if (!show || !post) return null;

  const handleUpdate = async () => {

  if (!text.trim() && !image) {
    toast.error("Post cannot be empty");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("text", text);

    if (image) {
      formData.append("image", image);
    }

    await API.put(
      `/posts/${post._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Post updated successfully!");

    if (fetchPosts) {
      await fetchPosts();
    }

    onClose();

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update post"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background:
            "rgba(0,0,0,.55)",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">

          <div className="modal-content">

            {/* Header */}

            <div className="modal-header">

              <h5 className="modal-title">
                ✏ Edit Post
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              ></button>

            </div>

            {/* Body */}

            <div className="modal-body">

              <textarea
                rows="5"
                className="form-control mb-3"
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="img-fluid rounded mb-3"
                  style={{
                    maxHeight:
                      "350px",
                    width: "100%",
                    objectFit:
                      "cover",
                  }}
                />
              )}

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files[0];

                  if (file) {
                    setImage(file);

                    setPreview(
                      URL.createObjectURL(
                        file
                      )
                    );
                  }
                }}
              />

            </div>

            {/* Footer */}

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>

                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default EditPostModal;