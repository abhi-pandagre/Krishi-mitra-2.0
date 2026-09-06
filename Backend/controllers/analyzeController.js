import { analyzeImage } from "../services/geminiService.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function analyzeController(req, res) {
  try {
    // Validate image presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded. Please provide an image file in the 'image' field.",
      });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported image type: ${req.file.mimetype}. Allowed types: JPEG, PNG, WEBP.`,
      });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: `Image too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
      });
    }

    const { crop, location, question, language } = req.body;

    // Call Gemini service
    const advisory = await analyzeImage({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      crop: crop?.trim() || "",
      location: location?.trim() || "",
      question: question?.trim() || "",
      language: language?.trim() || "English",
    });

    return res.status(200).json({
      success: true,
      data: advisory,
    });
  } catch (error) {
    console.error("analyzeController error:", error.message);

    // Don't leak internal details to the client
    const isKnownError =
      error.message.includes("GEMINI_API_KEY") ||
      error.message.includes("could not be parsed") ||
      error.message.includes("Unsupported") ||
      error.message.includes("too large");

    return res.status(500).json({
      success: false,
      message: isKnownError
        ? error.message
        : `Gemini error: ${error.message}`,
    });
  }
}
