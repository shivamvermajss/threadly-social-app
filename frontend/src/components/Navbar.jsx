import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

import {
  FaHome,
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaTimes,
  FaBookmark,
} from "react-icons/fa";

import NotificationDropdown from "./NotificationDropdown";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [showNotifications, setShowNotifications] =
  useState(false);

  const [unreadCount, setUnreadCount] =
  useState(0);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] =
  useState([]);

  const [showSearch, setShowSearch] =
  useState(false);

  const notificationRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };


  const fetchNotifications = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const res = await API.get(
      "/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const unread = res.data.filter(
      (item) => !item.isRead
    );

    setUnreadCount(unread.length);

  } catch (error) {
    console.log(error);
  }
};

const searchUsers = async (text) => {
  setSearch(text);

  if (!text.trim()) {
    setSearchResults([]);
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

    setSearchResults(res.data);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchNotifications();
}, []);



const searchRef = useRef(null);

useEffect(() => {
  const handleClick = (e) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target)
    ) {
      setShowSearch(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClick
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClick
    );
}, []);

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

}, []);

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm ${
        darkMode
          ? "navbar-dark bg-dark"
          : "navbar-light bg-white"
      }`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container">

        {/* Logo */}
        <Link
          to="/feed"
          className="navbar-brand fw-bold"
          style={{
            color: "#0d6efd",
            fontSize: "28px",
          }}
        >
          Threadly
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          {/* Left Side */}
          <ul className="navbar-nav mx-auto align-items-lg-center">

            <li className="nav-item">
              <Link
                to="/feed"
                className="nav-link"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>

            <li
  className="nav-item position-relative"
  ref={searchRef}
>

  <div className="d-flex align-items-center">

    <FaSearch
      className="me-2 text-muted"
    />

    <input
      type="text"
      className="form-control"
      placeholder="Search..."
      style={{
        width: "240px",
        borderRadius: "25px",
      }}
      value={search}
      onFocus={() =>
        setShowSearch(true)
      }
      onChange={(e) =>
        searchUsers(e.target.value)
      }
    />

    {search && (
      <button
        className="btn btn-sm"
        onClick={() => {
          setSearch("");
          setSearchResults([]);
        }}
      >
        <FaTimes />
      </button>
    )}

  </div>

  {showSearch && (
    <div
      className="card shadow-lg mt-2 position-absolute"
      style={{
        width: "300px",
        maxHeight: "400px",
        overflowY: "auto",
        zIndex: 9999,
      }}
    >

      {searchResults.length === 0 ? (

        <div className="p-3 text-muted text-center">
          Search users...
        </div>

      ) : (

        searchResults.map((item) => (

          <Link
            key={item._id}
            to={`/profile/${item.username}`}
            className="text-decoration-none text-dark"
            onClick={() => {
              setShowSearch(false);
              setSearch("");
            }}
          >
            <div className="d-flex align-items-center p-3 border-bottom">

              {item.avatar ? (

                <img
                  src={item.avatar}
                  alt=""
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 12,
                  }}
                />

              ) : (

                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    background: "#0d6efd",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                    fontWeight: "bold",
                  }}
                >
                  {item.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

              )}

              <div>

                <strong>
                  {item.username}
                </strong>

                <br />

                <small className="text-muted">
                  {item.bio || "No bio"}
                </small>

              </div>

            </div>

          </Link>

        ))

      )}

    </div>
  )}

</li>

            <li className="nav-item">
  <Link
    to={`/profile/${user?.username}`}
    className="nav-link"
  >
    Profile
  </Link>
</li>

<li className="nav-item">
  <Link
    to="/saved-posts"
    className="nav-link"
  >
    <FaBookmark className="me-1" />
    Saved
  </Link>
</li>

          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm"
            >
              {darkMode ? (
                <FaSun />
              ) : (
                <FaMoon />
              )}
            </button>

            {/* Notification */}
            <div
  className="position-relative"
  ref={notificationRef}
>

  <button
    className="btn position-relative"
    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }
  >

    <FaBell size={20} />

    {unreadCount > 0 && (
      <span
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      >
        {unreadCount}
      </span>
    )}

  </button>

  {showNotifications && (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "120%",
        zIndex: 9999,
      }}
    >
      <NotificationDropdown />
    </div>
  )}

</div>

            {/* Avatar */}
            <Link
              to={`/profile/${user?.username}`}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border:
                      "2px solid #0d6efd",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background:
                      "#0d6efd",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    fontWeight: "bold",
                  }}
                >
                  {user?.username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </Link>

            {/* Logout */}
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;