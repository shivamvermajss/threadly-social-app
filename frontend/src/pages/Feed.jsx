import { useEffect, useState } from "react";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
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
        className="container mt-4"
        style={{
          maxWidth: "700px",
        }}
      >
        <div className="mb-4">
          <h2
            style={{
              fontWeight: "700",
              color: "#0d6efd",
            }}
          >
            Social Feed
          </h2>

          <p className="text-muted">
            Share your thoughts with everyone
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <CreatePost fetchPosts={fetchPosts} />

        {posts.length === 0 ? (
          <div className="text-center mt-5">
            <h5>No Posts Yet</h5>

            <p className="text-muted">
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