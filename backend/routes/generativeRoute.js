import express from "express";
import { extractSkills, matchScore, smartSuggestions } from "../controllers/generativeController.js";
import authUser from "../middlewares/authUser.js";

const generativeRouter = express.Router();

generativeRouter.post("/match-score", authUser, matchScore);
generativeRouter.get("/smart-suggestions", authUser, smartSuggestions);
 
generativeRouter.post("/extract-skills", authUser, extractSkills);

export default generativeRouter;