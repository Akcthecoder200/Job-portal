import Job from "../models/jobModel.js";

import express from "express";

export const createJob = async (req, res) => {
  const {
    title,
    description,
    skills,
    budgetOrSalary,
    location,
    tags,
    posterEmail,
  } = req.body;
  const newJob = new Job({
    title,
    description,
    skills,
    budgetOrSalary,
    location,
    tags,
    postedBy: req.userId,
    posterEmail,
  });

  try {
    await newJob.save();
    console.log("Job created successfully:", newJob);
    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    console.log("Fetching all jobs");
    const jobs = await Job.find().populate("postedBy", "name email");
    // console.log(jobs);
    
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobsBySkill = async (req, res) => {
  const { skill } = req.params;
  try {
    const jobs = await Job.find({ skills: { $regex: skill, $options: "i" } });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs by skill:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobsByTags = async (req, res) => {
  const { tag } = req.params;
  try {
    const jobs = await Job.find({ tags: { $regex: tag, $options: "i" } });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs by tags:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobsByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    const jobs = await Job.find({
      location: { $regex: location, $options: "i" },
    });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs by location:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    // req.userId comes from your authUser middleware
    const userJobs = await Job.find({ postedBy: req.userId })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({ 
      success: true, 
      jobs: userJobs,
      count: userJobs.length 
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching user posts" 
    });
  }
};