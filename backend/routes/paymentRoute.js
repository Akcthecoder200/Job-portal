import { confirmPayment } from "../controllers/paymentController.js";
import authUser from "../middlewares/authUser.js";
import express from "express";
const paymentRouter = express.Router();

paymentRouter.post("/confirm-payment", authUser, confirmPayment);

export default paymentRouter;
