import { createJob, getJobs, getJobsByLocation, getJobsBySkill, getJobsByTags } from "../controllers/jobController.js";
import authUser from "../middlewares/authUser.js";

import express from "express";

const jobRouter = express.Router();

jobRouter.get('/get-jobs', authUser, getJobs);
jobRouter.post("/create-job", authUser, createJob);


jobRouter.get('/get-jobs-by-skill/:skill', authUser, getJobsBySkill);
jobRouter.get('/get-jobs-by-tags/:tag', authUser, getJobsByTags);
jobRouter.get('/get-jobs-by-location/:location', authUser, getJobsByLocation);

export default jobRouter;



