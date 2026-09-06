import { useState, useEffect, useRef } from "react";

/**
 * Microphone button that uses the Web Speech API to transcribe speech.
 * Renders nothing if the browser doesn't support SpeechRecognition.
 */
export default function VoiceInput({ onTranscript, language }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const getLang = () => (language === "Hindi" ? "hi-IN" : "en-IN");

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.lang = getLang();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setInterimText("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      setInterimText(interim);
      if (final) {
        onTranscript(final.trim());
        setInterimText("");
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      setListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterimText("");
  };

  if (!supported) return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        title={listening ? "Stop listening" : "Speak your question"}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        className={`
          flex items-center justify-center w-11 h-11 rounded-xl border-2 transition-all duration-200 shrink-0
          ${listening
            ? "border-red-400 bg-red-50 text-red-600 animate-pulse"
            : "border-gray-300 bg-white text-gray-500 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
          }
        `}
      >
        {listening ? (
          /* Stop icon */
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        ) : (
          /* Microphone icon */
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Live interim transcript */}
      {interimText && (
        <span className="text-xs text-gray-500 italic max-w-[160px] text-right truncate">
          "{interimText}…"
        </span>
      )}
      {listening && !interimText && (
        <span className="text-xs text-red-500 font-medium">Listening…</span>
      )}
    </div>
  );
}
