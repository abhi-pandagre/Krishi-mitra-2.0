import { useState, useRef } from "react";
import { analyzeCrop } from "./services/api";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ImageUploader from "./components/ImageUploader";
import FarmerInput from "./components/FarmerInput";
import LanguageSelector from "./components/LanguageSelector";
import VoiceInput from "./components/VoiceInput";
import AnalyzeButton from "./components/AnalyzeButton";
import LoadingState from "./components/LoadingState";
import AnalysisResult from "./components/AnalysisResult";

// ─── friendly error messages ────────────────────────────
function parseError(err) {
  if (!err) return "Something went wrong. Please try again.";

  // Network / no backend
  if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
    return "Could not reach the server. Please make sure the backend is running and try again.";
  }
  // Timeout
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return "The AI service took too long to respond. Please try again in a moment.";
  }
  // Server returned an error body
  const serverMsg = err.response?.data?.error || err.response?.data?.message;
  if (serverMsg) {
    if (serverMsg.toLowerCase().includes("gemini") || serverMsg.toLowerCase().includes("ai")) {
      return "The AI service is temporarily unavailable. Please try again.";
    }
    return serverMsg;
  }
  if (err.response?.status === 413) return "The image is too large. Please use a smaller photo.";
  if (err.response?.status === 429) return "Too many requests. Please wait a moment and try again.";
  if (err.response?.status >= 500) return "The server encountered an error. Please try again.";

  return "We couldn't analyze the crop right now. Please try again.";
}

// ─── About section ──────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About KrishiMitra AI</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          KrishiMitra AI is an AI-powered agricultural assistant designed for Indian farmers.
          Using Google Gemini's advanced vision capabilities, it helps identify crop diseases,
          pests, and nutrient deficiencies from a simple photo — providing actionable advice
          in your preferred language.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "🤖", label: "Powered by Gemini AI" },
            { icon: "🌐", label: "Hindi & English" },
            { icon: "📱", label: "Mobile Friendly" },
            { icon: "🆓", label: "Free to Use" },
          ].map((item) => (
            <div key={item.label} className="bg-primary-50 rounded-xl p-4">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-medium text-primary-800">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main App ────────────────────────────────────────────
export default function App() {
  // Form state
  const [image, setImage] = useState(null);       // { file, previewUrl }
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");

  // Request state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);     // API response data
  const [error, setError] = useState("");

  const analyzeRef = useRef(null);
  const resultRef = useRef(null);

  // Scroll helper
  const scrollTo = (ref) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  // Hero CTA → scroll to form
  const handleHeroCTA = () => scrollTo(analyzeRef);

  // Voice transcript → append to question
  const handleTranscript = (text) => {
    setQuestion((prev) => (prev ? `${prev} ${text}` : text));
  };

  // Reset to fresh form
  const handleReset = () => {
    setResult(null);
    setError("");
    setImage(null);
    setCrop("");
    setLocation("");
    setQuestion("");
    setLanguage("English");
    scrollTo(analyzeRef);
  };

  // Submit
  const handleAnalyze = async () => {
    if (!image?.file) {
      setError("Please upload a crop image first.");
      scrollTo(analyzeRef);
      return;
    }
    if (loading) return;

    setError("");
    setResult(null);
    setLoading(true);
    scrollTo(analyzeRef);

    try {
      const formData = new FormData();
      formData.append("image", image.file);
      if (crop.trim())     formData.append("crop", crop.trim());
      if (location.trim()) formData.append("location", location.trim());
      if (question.trim()) formData.append("question", question.trim());
      formData.append("language", language);

      const response = await analyzeCrop(formData);
      const body = response.data;

      if (body?.success && body?.data) {
        setResult(body.data);
        scrollTo(resultRef);
      } else {
        setError("The AI returned an unexpected response. Please try again.");
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <Hero onAnalyzeClick={handleHeroCTA} />

      {/* ── Analysis form + results ── */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8" id="analyze">
        <div className="max-w-2xl mx-auto space-y-6" ref={analyzeRef}>

          {/* Section title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">🌿 Crop Analysis</h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details below and let AI examine your crop
            </p>
          </div>

          {/* Card wrapper */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* ── Image uploader ── */}
            <div className="p-6 border-b border-gray-100">
              <ImageUploader image={image} onImageChange={setImage} />
            </div>

            {/* ── Crop details ── */}
            <div className="p-6 space-y-5 border-b border-gray-100">
              <FarmerInput
                id="crop-name"
                label="Crop Name"
                icon="🌾"
                value={crop}
                onChange={setCrop}
                placeholder="e.g. Tomato, Wheat, Rice"
                optional
                hint="Leave blank and Gemini will try to identify the crop from the photo."
              />
              <FarmerInput
                id="location"
                label="Your Location"
                icon="📍"
                value={location}
                onChange={setLocation}
                placeholder="e.g. Indore, Madhya Pradesh"
                optional
                hint="Helps the AI give location-specific advice."
              />
            </div>

            {/* ── Question with voice input ── */}
            <div className="p-6 border-b border-gray-100">
              <div className="space-y-1.5">
                <label htmlFor="farmer-question" className="block text-sm font-semibold text-gray-700">
                  💬 What would you like to know?{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <p className="text-xs text-gray-500">
                  Ask anything about your crop. You can also tap the microphone to speak.
                </p>
                <div className="flex gap-2 items-start">
                  <textarea
                    id="farmer-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder='e.g. "Why are the leaves turning brown?"'
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors text-base resize-none"
                  />
                  <VoiceInput onTranscript={handleTranscript} language={language} />
                </div>
              </div>
            </div>

            {/* ── Language selector ── */}
            <div className="p-6 border-b border-gray-100">
              <LanguageSelector language={language} onChange={setLanguage} />
            </div>

            {/* ── Error banner ── */}
            {error && (
              <div
                role="alert"
                className="mx-6 mb-0 mt-0 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5"
              >
                <span className="text-red-500 text-lg shrink-0">⚠️</span>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* ── Analyze button ── */}
            <div className="p-6">
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={!image}
                loading={loading}
              />
              {!image && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  Upload a crop photo to enable analysis
                </p>
              )}
            </div>
          </div>

          {/* ── Loading state ── */}
          {loading && (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <LoadingState />
            </div>
          )}

          {/* ── Results ── */}
          {result && !loading && (
            <div
              ref={resultRef}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
            >
              <AnalysisResult
                data={result}
                language={language}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-lg">KrishiMitra AI</span>
          </div>
          <p className="text-primary-200 text-sm">
            Empowering Indian farmers with AI-driven agricultural intelligence.
          </p>
          <p className="text-primary-400 text-xs mt-3">
            Built with ❤️ for Bharat's farmers · Powered by Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
