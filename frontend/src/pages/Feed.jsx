import { useEffect, useState, useContext } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

import { ThemeContext } from "../context/ThemeContext";

function Feed() {
  const { darkMode } = useContext(ThemeContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");

      setPosts(res.data);
    } catch (error) {
      console.log(error);

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-5">
          <h5>Loading Posts...</h5>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        className="container mt-4 pb-5"
        style={{
          maxWidth: "700px",
        }}
      >
        <div className="mb-4">

          <h2
            className="fw-bold"
            style={{
              color: darkMode
                ? "#ffffff"
                : "#0d6efd",
            }}
          >
            Threadly Feed
          </h2>

          <p className="text-muted">
            Share your thoughts with everyone
          </p>

        </div>

        {/* Search */}

        <input
          type="text"
          className="form-control mb-4"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Create */}

        <CreatePost
          fetchPosts={fetchPosts}
        />

        {/* Posts */}

        {posts.length === 0 ? (
          <div className="card p-5 text-center">

            <h4>No Posts Yet 📷</h4>

            <p className="text-muted mb-0">
              Create your first post.
            </p>

          </div>
        ) : (
          posts
            .filter((post) =>
              post.text
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map((post) => (
              <PostCard
                key={post._id}
                post={post}
                fetchPosts={fetchPosts}
              />
            ))
        )}

      </div>
    </>
  );
}

export default Feed;