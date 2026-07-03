const Notification = require("../models/Notification");

const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        receiver: req.user.id,
      })
        .populate(
          "sender",
          "username avatar"
        )
        .sort({
          createdAt: -1,
        });

    res.json(notifications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const markAsRead = async (
  req,
  res
) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      }
    );

    res.json({
      message:
        "Notification Updated",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getNotifications,
  markAsRead,
};