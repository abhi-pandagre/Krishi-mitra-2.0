export default function AnalyzeButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        w-full flex items-center justify-center gap-3
        py-4 px-6 rounded-2xl text-lg font-bold
        transition-all duration-300 shadow-lg
        ${disabled || loading
          ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          : "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-xl active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      {loading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Analyzing…</span>
        </>
      ) : (
        <>
          <span className="text-xl">🌱</span>
          <span>Analyze My Crop</span>
        </>
      )}
    </button>
  );
}
