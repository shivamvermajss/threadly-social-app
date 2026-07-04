import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);

      setPost(res.data);
    } catch (error) {
      console.log(error);

      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="container text-center mt-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          ></div>

          <h5>Loading Post...</h5>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />

        <div className="container mt-5 text-center">
          <div className="card p-5 shadow-sm">
            <h3>Post not found</h3>

            <p className="text-muted mb-0">
              This post may have been deleted or doesn't exist.
            </p>
          </div>
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
          maxWidth: "750px",
        }}
      >
        <h2 className="fw-bold mb-4">
          Shared Post
        </h2>

        <PostCard
          post={post}
          fetchPosts={fetchPost}
        />
      </div>
    </>
  );
}

export default PostDetails;