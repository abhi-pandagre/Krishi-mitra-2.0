import { useRef, useState, useCallback } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

export default function ImageUploader({ image, onImageChange }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState("");

  const validateAndSet = useCallback(
    (file) => {
      setSizeError("");
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setSizeError("Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setSizeError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onImageChange({ file, previewUrl });
    },
    [onImageChange]
  );

  const handleFileInput = (e) => {
    validateAndSet(e.target.files?.[0]);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = () => {
    setSizeError("");
    if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Crop / Leaf Photo <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500">Upload a clear photo of the affected leaf or crop. (JPG, PNG, WEBP · max {MAX_SIZE_MB} MB)</p>

      {image ? (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary-200 shadow-md">
          <img
            src={image.previewUrl}
            alt="Selected crop preview"
            className="w-full max-h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-white text-xs font-medium bg-black/40 rounded-lg px-2 py-1 truncate max-w-[70%]">
              {image.file.name}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow"
              aria-label="Remove selected image"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Click or drag and drop to upload crop image"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative flex flex-col items-center justify-center gap-3
            border-2 border-dashed rounded-2xl p-8 cursor-pointer
            transition-all duration-200 min-h-[180px]
            ${dragging
              ? "border-primary-500 bg-primary-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50"
            }
          `}
        >
          <div className={`text-5xl transition-transform duration-200 ${dragging ? "scale-125" : ""}`}>
            📷
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              {dragging ? "Drop the image here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP supported</p>
          </div>
          <span className="text-xs text-primary-600 font-medium bg-primary-100 px-3 py-1 rounded-full">
            Browse Files
          </span>
        </div>
      )}

      {sizeError && (
        <p role="alert" className="text-sm text-red-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {sizeError}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
