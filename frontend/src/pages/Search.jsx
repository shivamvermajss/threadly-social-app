import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const searchUsers = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setUsers([]);
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        `/users/search/users?q=${text}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container mt-4"
        style={{
          maxWidth: "700px",
        }}
      >
        <input
          className="form-control form-control-lg"
          placeholder="Search users..."
          value={query}
          onChange={(e) =>
            searchUsers(e.target.value)
          }
        />

        <div className="mt-4">

          {users.map((user) => (

            <Link
              key={user._id}
              to={`/profile/${user.username}`}
              className="text-decoration-none text-dark"
            >
              <div className="card p-3 mb-3">

                <div className="d-flex align-items-center">

                  {user.avatar ? (

                    <img
                      src={user.avatar}
                      alt=""
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: 15,
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: "50%",
                        background: "#0d6efd",
                        color: "white",
                        display: "flex",
                        justifyContent:
                          "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        marginRight: 15,
                      }}
                    >
                      {user.username
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                  )}

                  <div>

                    <h5 className="mb-1">
                      {user.username}
                    </h5>

                    <small className="text-muted">
                      {user.bio ||
                        "No bio yet"}
                    </small>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </>
  );
}

export default Search;