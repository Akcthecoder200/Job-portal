// server.js
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import dashboardRouter from "./routes/dashboardRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());


app.use("/api/user", userRouter);
app.use("/api", dashboardRouter);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
