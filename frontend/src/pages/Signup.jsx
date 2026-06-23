import { useState } from "react";
import API from "../services/api";
import {
  useNavigate,
  Navigate,
  Link,
} from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/feed" replace />;
  }

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [avatar, setAvatar] =
    useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "username",
        username
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "password",
        password
      );

      if (avatar) {
        formData.append(
          "avatar",
          avatar
        );
      }

      // Signup
      await API.post(
        "/auth/signup",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // Auto Login
      const loginRes = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        loginRes.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loginRes.data.user
        )
      );

      toast.success(
        "Account Created Successfully ✅"
      );

      navigate("/feed");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Signup Failed ❌"
      );
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "15px",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{ color: "#198754" }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <label className="mb-2">
            Profile Image
          </label>

          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) =>
              setAvatar(
                e.target.files[0]
              )
            }
          />

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;