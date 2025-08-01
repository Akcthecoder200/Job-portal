// models/Job.js
import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    budgetOrSalary: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    tags: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    posterEmail: {
      type: String,
      required: true,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
