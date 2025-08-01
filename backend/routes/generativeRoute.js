import express from "express";
import { extractSkills, matchScore, smartSuggestions } from "../controllers/generativeController.js";
import authUser from "../middlewares/authUser.js";

const generativeRouter = express.Router();

generativeRouter.post("/match-score", authUser, matchScore);
generativeRouter.get("/smart-suggestions", authUser, smartSuggestions);
 
generativeRouter.post("/extract-skills", authUser, extractSkills); // Added GET route for match score

export default generativeRouter;