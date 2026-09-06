export default function Hero({ onAnalyzeClick }) {
  const steps = [
    { icon: "📷", title: "Upload Photo", desc: "Take a clear photo of your crop or affected leaf" },
    { icon: "🤖", title: "AI Analysis", desc: "Our AI powered by Google Gemini examines the image" },
    { icon: "📋", title: "Get Advice", desc: "Receive detailed recommendations in your language" },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            AI-Powered Agricultural Analysis
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            Understand your crop.
            <br />
            <span className="text-green-300">Get the right advice.</span>
          </h2>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Upload a photo of your crop and get AI-powered agricultural guidance
            based on your crop, location and conditions — in your language.
          </p>

          {/* CTA */}
          <button
            onClick={onAnalyzeClick}
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:bg-primary-50 hover:shadow-2xl transition-all duration-300 active:scale-95"
          >
            <span>🌱</span>
            Analyze My Crop
          </button>

          <p className="mt-4 text-white/60 text-sm">Free · No sign-up needed · Results in seconds</p>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors"
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-base mb-1">{step.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
