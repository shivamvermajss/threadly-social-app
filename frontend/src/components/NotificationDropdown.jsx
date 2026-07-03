import { useEffect, useState } from "react";
import API from "../services/api";
import { formatDistanceToNow } from "date-fns";

function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

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

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await API.put(
        `/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        className="card-header bg-white fw-bold"
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

          <p className="text-muted">
            You'll see likes, follows and comments here.
          </p>

        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item._id}
            onClick={() =>
              markAsRead(item._id)
            }
            className={`d-flex align-items-center p-3 border-bottom ${
              item.isRead
                ? ""
                : "bg-light"
            }`}
            style={{
              cursor: "pointer",
              transition:
                "all .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "#f8f9fa";
            }}
            onMouseLeave={(e) => {
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
                  background:
                    "#0d6efd",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  fontWeight: "bold",
                  marginRight: "12px",
                }}
              >
                {item.sender?.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            )}

            {/* Notification Text */}

            <div className="flex-grow-1">

              <div
                style={{
                  fontSize: "15px",
                }}
              >
                <strong>
                  {item.sender?.username}
                </strong>{" "}

                {item.type ===
                  "follow" &&
                  "started following you"}

                {item.type ===
                  "like" &&
                  "liked your post ❤️"}

                {item.type ===
                  "comment" &&
                  "commented on your post 💬"}
              </div>

              <small className="text-muted">
                {formatDistanceToNow(
                  new Date(
                    item.createdAt
                  ),
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
                  background:
                    "#0d6efd",
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationDropdown;