import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    try {
      const res = await API.get("/users/saved");

      setPosts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="container mt-5 text-center">
          <h4>Loading Saved Posts...</h4>
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
        <h2 className="mb-4">🔖 Saved Posts</h2>

        {posts.length === 0 ? (
          <div className="card p-5 shadow-sm text-center">
            <h4>No Saved Posts</h4>

            <p className="text-muted mb-0">
              Save posts to view them here.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              fetchPosts={fetchSavedPosts}
            />
          ))
        )}
      </div>
    </>
  );
}

export default SavedPosts;