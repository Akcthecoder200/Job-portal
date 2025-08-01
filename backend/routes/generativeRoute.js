import express from "express";
import { matchScore, smartSuggestions } from "../controllers/generativeController.js";
import authUser from "../middlewares/authUser.js";

const generativeRouter = express.Router();

generativeRouter.post("/match-score", authUser, matchScore);
generativeRouter.get("/smart-suggestions", authUser, smartSuggestions);

export default generativeRouter;