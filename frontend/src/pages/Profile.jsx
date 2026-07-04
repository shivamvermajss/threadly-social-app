import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";

function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);

  // Logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  // Check if viewing own profile
  const isOwnProfile =
    currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

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

        <div className="container mt-5 text-center">
          <h5>Loading Profile...</h5>
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
          maxWidth: "850px",
        }}
      >
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          fetchProfile={fetchProfile}
          setProfile={setProfile}
        />

        {/* User Posts */}
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              fetchPosts={fetchProfile}
            />
          ))
        ) : (
          <div className="card shadow-sm p-5 text-center">
            <h4>No Posts Yet 📷</h4>

            <p className="text-muted mb-0">
              This user hasn't shared any posts yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;