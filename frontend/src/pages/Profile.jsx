import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(
        `/users/${username}`
      );

      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) {
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
        className="container mt-4"
        style={{
          maxWidth: "700px",
        }}
      >
        <div className="card p-4 mb-4 shadow-sm">
          <div className="text-center">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#0d6efd",
                color: "white",
                margin: "auto",
                fontSize: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {profile.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3 className="mt-3">
              {profile.username}
            </h3>

            <div className="d-flex justify-content-center gap-4 mt-3">
              <div>
                <strong>
                  {profile.totalPosts}
                </strong>
                <br />
                Posts
              </div>

              <div>
                <strong>
                  {profile.totalLikes}
                </strong>
                <br />
                Likes
              </div>
            </div>
          </div>
        </div>

        {profile.posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            fetchPosts={fetchProfile}
          />
        ))}
      </div>
    </>
  );
}

export default Profile;