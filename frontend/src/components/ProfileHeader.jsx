import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function ProfileHeader({
  profile,
  isOwnProfile,
  fetchProfile,
  setProfile,
}) {
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [followers, setFollowers] =
    useState(profile.followers);

  const [isFollowing, setIsFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);   

  useEffect(() => {
    if (
      profile.followersList &&
      currentUser
    ) {
      setIsFollowing(
        profile.followersList.some(
          (id) =>
            id.toString() === currentUser.id
        )
      );
    }
  }, [profile, currentUser]);

  const handleFollow = async () => {
  if (loading) return;

  try {
    setLoading(true);

    const token =
      localStorage.getItem("token");

    const res = await API.put(
      `/users/follow/${profile.userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFollowers(
      res.data.followersCount
    );

    setIsFollowing(
      res.data.following
    );

    // Update profile state instantly
    setProfile((prev) => ({
      ...prev,
      followers:
        res.data.followersCount,
    }));

    // Update localStorage
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user) {
      user.following =
        user.following || [];

      if (res.data.following) {
        if (
          !user.following.includes(
            profile.userId
          )
        ) {
          user.following.push(
            profile.userId
          );
        }
      } else {
        user.following =
          user.following.filter(
            (id) =>
              id !== profile.userId
          );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    }

    toast.success(
      res.data.message
    );

    fetchProfile();

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
        "Something went wrong"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div
      className="card shadow border-0 mb-4 overflow-hidden"
      style={{
        borderRadius: "20px",
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          height: "220px",
          background: profile.coverImage
            ? `url(${profile.coverImage}) center/cover`
            : "linear-gradient(135deg,#0d6efd,#6ea8fe,#4f8cff)",
        }}
      />

      <div className="text-center px-4 pb-4">
        {/* Avatar */}
        <div
          style={{
            marginTop: "-65px",
          }}
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="avatar"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid white",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,.2)",
              }}
            />
          ) : (
            <div
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#0d6efd,#6ea8fe)",
                color: "white",
                fontSize: "48px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                border: "5px solid white",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,.2)",
              }}
            >
              {profile.username
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Username */}
        <h2 className="fw-bold mt-3">
          {profile.username}
        </h2>

        {/* Bio */}
        {profile.bio && (
          <p className="text-muted">
            {profile.bio}
          </p>
        )}

        {/* Location */}
        {profile.location && (
          <p className="mb-1">
            📍 {profile.location}
          </p>
        )}

        {/* Website */}
        {profile.website && (
          <p className="mb-1">
            🌐{" "}
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none"
            >
              Visit Website
            </a>
          </p>
        )}

        {/* Joined */}
        {profile.createdAt && (
          <p className="text-muted">
            🗓 Joined{" "}
            {format(
              new Date(profile.createdAt),
              "MMMM yyyy"
            )}
          </p>
        )}

        {/* Stats */}
        <div className="row text-center mt-4 mb-4">
          <div className="col">
            <h5>{profile.totalPosts}</h5>
            <small>Posts</small>
          </div>

          <div className="col">
            <h5>{followers}</h5>
            <small>Followers</small>
          </div>

          <div className="col">
            <h5>{profile.following}</h5>
            <small>Following</small>
          </div>

          <div className="col">
            <h5>{profile.totalLikes}</h5>
            <small>Likes</small>
          </div>
        </div>

                {/* Buttons */}
        {isOwnProfile ? (
          <Link
            to="/edit-profile"
            className="btn btn-primary px-4"
          >
            ✏ Edit Profile
          </Link>
        ) : (
          <button
            onClick={handleFollow}
            disabled={loading}
            className={
              isFollowing
                ? "btn btn-success px-4"
                : "btn btn-outline-primary px-4"
            }
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Please wait...
              </>
            ) : isFollowing ? (
              "✔ Following"
            ) : (
              "➕ Follow"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;