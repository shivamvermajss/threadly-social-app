import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;

      setUsername(user.username || "");
      setBio(user.bio || "");
      setWebsite(user.website || "");
      setLocation(user.location || "");

      setAvatarPreview(user.avatar || "");
      setCoverPreview(user.coverImage || "");

    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("website", website);
      formData.append("location", location);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await API.put("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile Updated Successfully");

      navigate(`/profile/${username}`);

    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        className="container py-4"
        style={{ maxWidth: "700px" }}
      >
        <div className="card shadow p-4">

          <h2 className="mb-4 text-center">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Username</label>

              <input
                className="form-control"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label>Bio</label>

              <textarea
                rows="3"
                className="form-control"
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label>Website</label>

              <input
                className="form-control"
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label>Location</label>

              <input
                className="form-control"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />
            </div>

            <div className="mb-3">

              <label>Avatar</label>

              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="d-block rounded-circle mb-2"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                  }}
                />
              )}

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);

                  setAvatarPreview(
                    URL.createObjectURL(
                      e.target.files[0]
                    )
                  );
                }}
              />
            </div>

            <div className="mb-4">

              <label>Cover Image</label>

              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="cover"
                  className="img-fluid rounded mb-2"
                />
              )}

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {

                  setCoverImage(
                    e.target.files[0]
                  );

                  setCoverPreview(
                    URL.createObjectURL(
                      e.target.files[0]
                    )
                  );
                }}
              />
            </div>

            <button className="btn btn-primary w-100">
              Save Changes
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default EditProfile;