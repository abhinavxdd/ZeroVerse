const { GoogleGenerativeAI } = require("@google/generative-ai");
const Post = require("../models/Post");
const User = require("../models/User");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/confess
 * AI-moderated anonymous confession submission
 */
exports.createConfession = async (req, res) => {
  try {
    console.log("🔍 Confession submission received");
    console.log("Title:", req.body.title);
    console.log("Content:", req.body.content);

    const { title, content } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Combine title and content for AI moderation
    const fullText = `Title: ${title}\n\nContent: ${content}`;

    console.log("🤖 Calling Gemini AI for moderation...");

    // AI Moderation using Gemini 3 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are an AI moderator for an Indian college (NIT Hamirpur) anonymous confession platform called "ZeroVerse". Your task is to classify confessions using a Traffic Light system.

CONTEXT:
- This is a college community platform for students
- Users can speak in Hinglish (Hindi written in English like "yaar", "bhai", "kya baat hai")
- Common college slang is acceptable
- Light roasting and friendly banter is okay
- Indirect mentions of professors or college life are fine

TRAFFIC LIGHT SYSTEM:

🔴 RED (REJECT):
- Hate speech targeting religion, caste, gender, sexuality
- Severe bullying or harassment with intent to harm
- Explicit threats of violence or self-harm
- Extremely toxic or abusive language
- Sharing private information (doxxing)
- Sexually explicit content

🟡 YELLOW (FLAG for manual review):
- Mild negativity or complaints about college/professors
- Sarcasm or passive-aggressive tone
- Controversial opinions that might spark debate
- Roasting specific groups (but not individuals)
- Borderline inappropriate jokes
- Venting about personal problems

🟢 GREEN (APPROVE):
- Wholesome confessions
- Funny, relatable college experiences
- Harmless secrets or crushes
- Positive vibes and encouragement
- Academic struggles or success stories
- Clean humor and memes

Analyze this confession and return ONLY valid JSON in this exact format:
{
  "verdict": "APPROVE" | "REJECT" | "FLAG",
  "reason": "Brief explanation in 1-2 sentences"
}

CONFESSION TO MODERATE:
${fullText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("✅ AI Response received:", responseText);

    let aiDecision;
    try {
      aiDecision = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      // Fallback: Flag for manual review if AI response is invalid
      aiDecision = {
        verdict: "FLAG",
        reason: "AI moderation inconclusive - needs manual review",
      };
    }

    // Validate AI response format
    if (!["APPROVE", "REJECT", "FLAG"].includes(aiDecision.verdict)) {
      aiDecision = {
        verdict: "FLAG",
        reason: "Invalid AI response - needs manual review",
      };
    }

    console.log("📊 AI Verdict:", aiDecision.verdict);
    console.log("📝 AI Reason:", aiDecision.reason);

    // Handle based on verdict
    if (aiDecision.verdict === "REJECT") {
      console.log("❌ REJECTED - Not posting confession");
      return res.status(400).json({
        success: false,
        message: "Your confession could not be posted",
        reason: aiDecision.reason,
        verdict: "REJECT",
      });
    }

    // Create the confession post
    const postData = {
      title: title.trim(),
      content: content.trim(),
      category: "Confession",
      userId: userId,
      alias: "Anonymous User",
      isAnonymous: true,
      status: aiDecision.verdict === "APPROVE" ? "approved" : "pending",
      aiModerationReason: aiDecision.reason,
      likes: [],
      dislikes: [],
      comments: [],
    };

    const newConfession = await Post.create(postData);

    // Different responses based on status
    if (aiDecision.verdict === "FLAG") {
      return res.status(201).json({
        success: true,
        message: "Your confession has been submitted for review",
        confession: newConfession,
        status: "pending",
        reason: aiDecision.reason,
      });
    }

    // APPROVE case
    return res.status(201).json({
      success: true,
      message: "Your confession has been posted anonymously! 🤫",
      confession: newConfession,
      status: "approved",
    });
  } catch (error) {
    console.error("Error in confession submission:", error);

    // Handle Gemini API errors gracefully
    if (error.message?.includes("API key")) {
      return res.status(500).json({
        message: "AI moderation service unavailable. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to process confession. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/confess/pending
 * Get all pending confessions for admin review (optional - for future admin panel)
 */
exports.getPendingConfessions = async (req, res) => {
  try {
    const pendingConfessions = await Post.find({
      category: "Confession",
      status: "pending",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingConfessions.length,
      confessions: pendingConfessions,
    });
  } catch (error) {
    console.error("Error fetching pending confessions:", error);
    res.status(500).json({
      message: "Failed to fetch pending confessions",
    });
  }
};

/**
 * PATCH /api/confess/:id/approve
 * Approve a pending confession (admin only - for future)
 */
exports.approveConfession = async (req, res) => {
  try {
    const { id } = req.params;

    const confession = await Post.findById(id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.status !== "pending") {
      return res.status(400).json({
        message: "Only pending confessions can be approved",
      });
    }

    confession.status = "approved";
    await confession.save();

    res.status(200).json({
      success: true,
      message: "Confession approved",
      confession,
    });
  } catch (error) {
    console.error("Error approving confession:", error);
    res.status(500).json({ message: "Failed to approve confession" });
  }
};

/**
 * DELETE /api/confess/:id/reject
 * Reject a pending confession (admin only - for future)
 */
exports.rejectConfession = async (req, res) => {
  try {
    const { id } = req.params;

    const confession = await Post.findByIdAndDelete(id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    res.status(200).json({
      success: true,
      message: "Confession rejected and deleted",
    });
  } catch (error) {
    console.error("Error rejecting confession:", error);
    res.status(500).json({ message: "Failed to reject confession" });
  }
};
