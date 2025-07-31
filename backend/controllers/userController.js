import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/generateToekn.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
      token: generateToken(newUser.id),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
     console.log(`User ${user.email} logged in successfully`);
     
    res.json({
      message: "Logged in successfully",
      user: { id: user.id, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.userId;

    const userData = await userModel.findById(userId).select("-password");

    console.log(userId, userData);

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
