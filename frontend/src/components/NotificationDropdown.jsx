import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaComment,
  FaUserPlus,
} from "react-icons/fa";
import API from "../services/api";
import { formatDistanceToNow } from "date-fns";

function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get(
        "/notifications"
      );

      setNotifications(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const markAsRead = async (item) => {
    try {

      await API.put(
        `/notifications/${item._id}`
      );

      if (item.type === "follow") {

        navigate(
          `/profile/${item.sender.username}`
        );

      } else if (
        item.type === "like" ||
        item.type === "comment"
      ) {

        navigate(
          `/post/${item.post}`
        );

      }

      fetchNotifications();

    } catch (error) {

      console.log(error);

    }
  };

  if (loading) {
    return (
      <div
        className="card shadow"
        style={{
          width: "360px",
          padding: "30px",
        }}
      >
        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-3 mb-0">
            Loading Notifications...
          </p>

        </div>
      </div>
    );
  }
    return (
    <div
      className="card shadow-lg border-0"
      style={{
        width: "360px",
        maxHeight: "500px",
        overflowY: "auto",
        borderRadius: "18px",
      }}
    >
      {/* Header */}
      <div
        className="card-header fw-bold"
        style={{
          fontSize: "18px",
        }}
      >
        🔔 Notifications
      </div>

      {/* Empty */}
      {notifications.length === 0 ? (
        <div className="text-center p-5">
          <h1>🔔</h1>

          <h5>No Notifications Yet</h5>

          <p className="text-muted mb-0">
            You'll see likes, follows and comments here.
          </p>
        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item._id}
            onClick={() => markAsRead(item)}
            className={`d-flex align-items-center p-3 border-bottom ${
              item.isRead ? "" : "bg-light"
            }`}
            style={{
              cursor: "pointer",
              transition: "all .25s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
              e.currentTarget.style.background =
                "#f8f9fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";

              if (!item.isRead) {
                e.currentTarget.style.background =
                  "#f8f9fa";
              } else {
                e.currentTarget.style.background =
                  "";
              }
            }}
          >
            {/* Avatar */}

            {item.sender?.avatar ? (
              <img
                src={item.sender.avatar}
                alt="avatar"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "12px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#0d6efd",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginRight: "12px",
                }}
              >
                {item.sender?.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            )}

            {/* Text */}

            <div className="flex-grow-1">
              <div
                className="d-flex align-items-center"
                style={{
                  fontSize: "15px",
                }}
              >
                {item.type === "follow" && (
                  <FaUserPlus className="text-primary me-2" />
                )}

                {item.type === "like" && (
                  <FaHeart className="text-danger me-2" />
                )}

                {item.type === "comment" && (
                  <FaComment className="text-success me-2" />
                )}

                <div>
                  <strong>
                    {item.sender?.username}
                  </strong>{" "}

                  {item.type === "follow" &&
                    "started following you"}

                  {item.type === "like" &&
                    "liked your post"}

                  {item.type === "comment" &&
                    "commented on your post"}
                </div>
              </div>

              <small className="text-muted">
                {formatDistanceToNow(
                  new Date(item.createdAt),
                  {
                    addSuffix: true,
                  }
                )}
              </small>
            </div>

            {/* Unread Dot */}

            {!item.isRead && (
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#0d6efd",
                  marginLeft: "8px",
                }}
              ></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationDropdown;