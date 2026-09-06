const TIPS = [
  "Tip: Water your crops early in the morning to reduce evaporation.",
  "Tip: Crop rotation helps prevent soil nutrient depletion.",
  "Tip: Use neem-based sprays as a natural pesticide.",
  "Tip: Mulching around plants helps retain soil moisture.",
  "Tip: Test your soil pH before selecting fertilizers.",
];

export default function LoadingState() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Analyzing crop image, please wait"
      className="animate-fade-in flex flex-col items-center justify-center gap-6 py-12 px-6 text-center"
    >
      {/* Spinner ring */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          🌱
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">Analyzing your crop…</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Our AI is examining the image and preparing agricultural advice.
          <br />
          This usually takes 10–20 seconds.
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Farming tip */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl px-5 py-3 max-w-sm">
        <p className="text-xs text-primary-700 font-medium">💡 {tip}</p>
      </div>
    </div>
  );
}
