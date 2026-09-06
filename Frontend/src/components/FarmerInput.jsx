/**
 * Reusable labeled text-input for crop name, location, etc.
 */
export default function FarmerInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  icon,
  hint,
  rightAddon,
  as = "input",
  rows = 3,
}) {
  const baseClass =
    "w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 " +
    "transition-colors text-base bg-white disabled:bg-gray-50 disabled:text-gray-400";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {icon && <span className="mr-1.5">{icon}</span>}
        {label}
        {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      <div className={rightAddon ? "flex gap-2" : ""}>
        {as === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`${baseClass} resize-none`}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseClass} ${rightAddon ? "flex-1" : ""}`}
          />
        )}
        {rightAddon}
      </div>
    </div>
  );
}
