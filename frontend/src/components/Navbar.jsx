import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm px-4 ${
        darkMode
          ? "bg-dark navbar-dark"
          : "bg-white"
      }`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container">
        <h3
          className="m-0"
          style={{
            fontWeight: "700",
            color: darkMode
              ? "#ffffff"
              : "#0d6efd",
          }}
        >
          Social
        </h3>

        <div className="d-flex align-items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-outline-secondary"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <span style={{ fontSize: "22px" }}>
            🔔
          </span>

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #0d6efd",
              }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#0d6efd",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {user?.username
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;