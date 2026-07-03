function ProfileStats({ profile }) {
  return (
    <div className="card shadow-sm mb-4">

      <div className="row text-center p-3">

        <div className="col">
          <h4>{profile.totalPosts}</h4>
          <small>Posts</small>
        </div>

        <div className="col">
          <h4>{profile.followers}</h4>
          <small>Followers</small>
        </div>

        <div className="col">
          <h4>{profile.following}</h4>
          <small>Following</small>
        </div>

        <div className="col">
          <h4>{profile.totalLikes}</h4>
          <small>Likes</small>
        </div>

      </div>

    </div>
  );
}

export default ProfileStats;