import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Builds the prompt for Gemini based on farmer-provided context.
 */
function buildPrompt({ crop, location, question, language }) {
  const cropInfo = crop ? `The crop is: ${crop}.` : "The crop type is unknown — identify it if possible.";
  const locationInfo = location ? `The farmer is located in: ${location}.` : "";
  const questionInfo = question ? `Farmer's question: ${question}` : "";
  const langInfo = language || "English";

  return `
You are an expert agricultural advisory assistant for Indian farmers.

Analyze the provided crop or leaf image carefully.

${cropInfo}
${locationInfo}
${questionInfo}

Instructions:
- Identify the crop from the image if not provided.
- Identify any visible disease, pest damage, or abnormality. Do NOT claim certainty.
- If the image is unclear or low quality, explicitly say so and reflect that in the confidence score.
- Provide a confidence percentage (0–100) for your assessment.
- List visible symptoms observed in the image.
- Give practical, actionable recommendations suitable for small-scale Indian farmers.
- Assign a severity level: Low / Moderate / High / Critical.
- Assign an urgency level: Low / Medium / High / Immediate.
- Add a weather_advice field if location context allows a useful tip, otherwise leave it as an empty string.
- Avoid recommending specific chemical pesticides unless you are highly confident. Always suggest consulting a local agricultural expert (Krishi Kendra) when uncertain.
- Respond in: ${langInfo}.

You MUST respond with ONLY a valid JSON object in this exact format — no markdown, no explanation, no code fences:
{
  "crop": "string",
  "possible_issue": "string",
  "confidence": number,
  "severity": "string",
  "symptoms": ["string"],
  "recommendations": ["string"],
  "weather_advice": "string",
  "urgency": "string",
  "disclaimer": "This is an AI-based preliminary assessment and should be confirmed by an agricultural expert."
}
`.trim();
}

/**
 * Sends the image and context to Gemini and returns the parsed advisory JSON.
 */
export async function analyzeImage({ imageBuffer, mimeType, crop, location, question, language }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const prompt = buildPrompt({ crop, location, question, language });

  // Convert the image buffer to a base64 inline part for Gemini
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: mimeType,
    },
  };

  const response = await genai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [imagePart, { text: prompt }],
      },
    ],
  });

  const rawText = response.text ?? "";

  // Strip markdown code fences if Gemini wraps the JSON in them
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("Gemini raw response (failed to parse):", rawText);
    throw new Error("Gemini returned a response that could not be parsed as JSON.");
  }

  return parsed;
}
