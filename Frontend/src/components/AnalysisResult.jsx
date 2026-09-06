import VoiceOutput from "./VoiceOutput";

/* ─── helpers ─────────────────────────────────────────── */

function severityColor(severity = "") {
  const s = severity.toLowerCase();
  if (s.includes("high") || s.includes("severe") || s.includes("critical"))
    return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("moderate") || s.includes("medium"))
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-green-100 text-green-700 border-green-200";
}

function urgencyColor(urgency = "") {
  const u = urgency.toLowerCase();
  if (u.includes("high") || u.includes("immediate") || u.includes("urgent"))
    return "bg-red-100 text-red-700";
  if (u.includes("medium") || u.includes("moderate"))
    return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function ConfidenceBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const color = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">Confidence</span>
        <span className="font-bold text-gray-800">{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-3 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────── */

export default function AnalysisResult({ data, language, onReset }) {
  if (!data) return null;

  const {
    crop,
    possible_issue,
    confidence,
    severity,
    symptoms = [],
    recommendations = [],
    weather_advice,
    urgency,
    disclaimer,
  } = data;

  // Text that TTS will read aloud
  const ttsText = [
    crop ? `Crop: ${crop}.` : "",
    possible_issue ? `Issue detected: ${possible_issue}.` : "",
    severity ? `Severity: ${severity}.` : "",
    symptoms.length ? `Symptoms: ${symptoms.join(". ")}.` : "",
    recommendations.length ? `Recommendations: ${recommendations.join(". ")}.` : "",
    weather_advice ? `Weather advice: ${weather_advice}.` : "",
    urgency ? `Urgency level: ${urgency}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="animate-fade-in space-y-4" id="results" aria-live="polite">
      {/* ── Header row ───────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analysis Result</h2>
          <p className="text-gray-500 text-sm">AI-powered crop assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <VoiceOutput text={ttsText} language={language} />
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Analyze Again
          </button>
        </div>
      </div>

      {/* ── Crop + Issue card ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary-50 to-green-50 border border-primary-200 rounded-2xl p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="text-5xl">🌿</div>
          <div className="flex-1 min-w-0">
            {crop && (
              <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">Crop Identified</p>
            )}
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{crop || "Crop"}</h3>
            {possible_issue && (
              <p className="text-gray-700 mt-1 font-medium text-lg">{possible_issue}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {severity && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${severityColor(severity)}`}>
                {severity} Severity
              </span>
            )}
            {urgency && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${urgencyColor(urgency)}`}>
                ⚡ {urgency} Urgency
              </span>
            )}
          </div>
        </div>

        {confidence !== undefined && confidence !== null && (
          <div className="mt-4">
            <ConfidenceBar value={confidence} />
          </div>
        )}
      </div>

      {/* ── Symptoms ──────────────────────────────────────── */}
      {symptoms.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🔍</span> Symptoms Observed
          </h4>
          <ul className="space-y-2">
            {symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Recommendations ───────────────────────────────── */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>✅</span> Recommended Actions
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3"
              >
                <span className="text-primary-600 font-bold text-sm shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weather advice (only if non-empty) ────────────── */}
      {weather_advice && weather_advice.trim() && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
          <h4 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
            <span>🌤️</span> Weather Advice
          </h4>
          <p className="text-sky-700 text-sm leading-relaxed">{weather_advice}</p>
        </div>
      )}

      {/* ── Disclaimer ────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
        <p className="text-amber-800 text-xs leading-relaxed">
          {disclaimer ||
            "This is an AI-based preliminary assessment and should be confirmed by a qualified agricultural expert before taking major action."}
        </p>
      </div>
    </div>
  );
}
