import userModel from "../models/userModel.js";

export const dashboardController = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Welcome to the dashboard, ${user.email}!`,
      userId: userId,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res
      .status(500)
      .json({ message: "Server error while retrieving dashboard data" });
  }
};
