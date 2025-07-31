import express from "express";
import authUser from "../middlewares/authUser.js";
import { dashboardController } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", authUser, dashboardController);

export default dashboardRouter;
