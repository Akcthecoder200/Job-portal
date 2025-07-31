// models/Job.js
import mongoose from 'mongoose';

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
      type: [String], // Array of required skills for the job
      required: true,
    },
    budgetOrSalary: {
      type: String, // Can be a range, fixed amount, or text
      required: true,
    },
    location: {
      type: String,
      default: 'Remote', // Default to 'Remote' if not specified
    },
    tags: {
      type: [String], // Additional tags for filtering
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who posted the job
      required: true,
      ref: 'user',
        // Refers to the 'User' model
    },
    posterEmail: { // Storing email directly for easier display
      type: String,
      required: true,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false, // This will be updated to true after blockchain payment in Module 3
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
