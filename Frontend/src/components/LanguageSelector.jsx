const LANGUAGES = [
  { value: "English", label: "English", flag: "🇬🇧" },
  { value: "Hindi",   label: "हिंदी",    flag: "🇮🇳" },
];

export default function LanguageSelector({ language, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        🌐 Response Language
      </label>
      <p className="text-xs text-gray-500">Choose the language for the AI advisory</p>

      <div className="flex gap-3" role="radiogroup" aria-label="Response language">
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.value;
          return (
            <button
              key={lang.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(lang.value)}
              className={`
                flex items-center gap-2 flex-1 justify-center py-3 px-4 rounded-xl border-2 font-semibold text-sm
                transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-primary-50"
                }
              `}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.label}</span>
              {isSelected && (
                <svg className="w-4 h-4 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
