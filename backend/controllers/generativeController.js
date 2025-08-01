import Job from "../models/jobModel.js";
import userModel from "../models/userModel.js";

export const matchScore = async (req, res) => {
  console.log("Received request to match score");
  const { jobDescription, userBio, userSkills } = req.body;

  if (!jobDescription || !userBio || !userSkills) {
    return res
      .status(400)
      .json({ message: "Missing job or user data for matching." });
  }

  const userProfile = `Bio: ${userBio}\nSkills: ${userSkills.join(", ")}`;

  const prompt = `Act as an expert job recruiter. Compare the following user profile with the job description.
  
  Provide a 'match score' from 0 to 100 based on skill relevance, experience, and keywords. Also, provide a brief 'rationale' explaining the score, mentioning key matching points and any major missing skills.
  
  Job Description:
  """
  ${jobDescription}
  """
  
  User Profile:
  """
  ${userProfile}
  """
  
  Please provide the response in a JSON object with the following structure:
  { "matchScore": "integer", "rationale": "string" }`;

  try {
    // log("Prompt for AI");
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyDW9l9jgavTk-Xu0sa2TEb3_2muHXBDdOs";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    // log("AI Response:", result);
    const aiResponseText = result.candidates[0].content.parts[0].text;
    // console.log("AI Response:", aiResponseText); // Remove Markdown code fences if present
    const cleaned = aiResponseText.replace(/```json|```/g, "").trim();
    const aiResponse = JSON.parse(cleaned);

    res.json({
      message: "Match score calculated successfully",
      ...aiResponse,
    });
  } catch (error) {
    console.error("AI matching error:", error);
    res.status(500).json({ message: "Server error during AI matching." });
  }
};

export const smartSuggestions = async (req, res) => {
  try {
    // Correctly fetch the user's profile with one database query
    const user = await userModel.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = `Bio: ${user.bio}\nSkills: ${user.skills.join(", ")}`;

    const prompt = `Based on the following user profile, recommend 3 to 5 relevant job titles. 
    For each recommendation, provide a brief, one-sentence explanation of why it's a good fit.
    Only return a JSON array of objects with the following structure, do not include any other text or explanation:
    [
      { "title": "Job Title", "reason": "Explanation" },
      ...
    ]
    
    User Profile:
    """
    ${userProfile}
    """`;

    // Fetch a sample of recent jobs for the AI to consider
    const jobs = await Job.find().limit(50);
    const jobDescriptions = jobs
      .map(
        (job) =>
          `Job ID: ${job._id}\nTitle: ${job.title}\nSkills: ${job.skills.join(
            ", "
          )}\nDescription: ${job.description}`
      )
      .join("\n---\n");

    const combinedPrompt = `${prompt}\n\nHere are some jobs to consider:\n\n${jobDescriptions}`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: combinedPrompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyDW9l9jgavTk-Xu0sa2TEb3_2muHXBDdOs";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const aiResponseText = result.candidates[0].content.parts[0].text;

    // Attempt to parse the response as JSON, cleaning up any non-JSON text
    let aiRecommendations;
    try {
      // First, remove Markdown code fences if present
      const cleanedResponseText = aiResponseText
        .replace(/```json|```/g, "")
        .trim();
      aiRecommendations = JSON.parse(cleanedResponseText);
    } catch (parseError) {
      // If parsing fails, it's likely due to conversational text.
      // Log the original response for debugging and return an empty array.
      console.error(
        "Failed to parse AI response as JSON. Original response:",
        aiResponseText
      );
      return res.status(500).json({
        message: "Server error: AI provided an unparseable response.",
        recommendations: [],
      });
    }

    res.json({
      message: "Smart suggestions generated successfully",
      recommendations: aiRecommendations,
    });
  } catch (error) {
    console.error("AI smart suggestions error:", error);
    res.status(500).json({ message: "Server error during smart suggestions." });
  }
};

export const extractSkills = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Please provide text to extract skills from." });
    }

    const prompt = `Extract all key technical and soft skills from the following text. 
    Return the skills as a comma-separated list of single words or short phrases. 
    Do not include any other text, formatting, or explanations in your response.
    
    Text:
    """
    ${text}
    """`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyDW9l9jgavTk-Xu0sa2TEb3_2muHXBDdOs";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const extractedText = result.candidates[0].content.parts[0].text;

    // Split the comma-separated string into an array and clean up whitespace
    const skills = extractedText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 10);

    res.json({
      message: "Skills extracted successfully",
      skills: skills,
    });
  } catch (error) {
    console.error("AI skill extraction error:", error);
    res
      .status(500)
      .json({ message: "Server error during AI skill extraction." });
  }
};
