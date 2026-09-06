import axios from "axios";

// Change this to your backend URL when deploying
export const API_URL = "http://localhost:5000";

/**
 * Send a crop image + context to the backend for Gemini analysis.
 * @param {FormData} formData  Fields: image, crop, location, question, language
 * @returns {Promise<Object>} The full Axios response
 */
export async function analyzeCrop(formData) {
  const response = await axios.post(`${API_URL}/api/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000, // 60 s – Gemini can be slow on first call
  });
  return response;
}
