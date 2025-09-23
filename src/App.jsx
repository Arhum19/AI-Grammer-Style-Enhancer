import { useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ResultCard from "./components/ResultCard";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("grammar");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = [
    {
      value: "grammar",
      label: "Grammar Fix",
      icon: "✓",
      description: "Correct grammar and spelling",
      color:
        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
    },
    {
      value: "slang",
      label: "Casual Slang",
      icon: "😎",
      description: "Modern, informal language",
      color:
        "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-gray-800",
    },
    {
      value: "formal",
      label: "Formal",
      icon: "📄",
      description: "Professional, business tone",
      color:
        "bg-gradient-to-r from-purple-300 to-purple-500 hover:from-purple-400 hover:to-purple-600 text-white",
    },
    {
      value: "persuasive",
      label: "Persuasive",
      icon: "🎯",
      description: "Compelling, convincing style",
      color:
        "bg-gradient-to-r from-pink-300 to-rose-500 hover:from-pink-400 hover:to-rose-600 text-white",
    },
  ];

  const handleEnhance = async () => {
    if (!text.trim()) {
      setError("Please enter some text to enhance");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Use relative path; Vite dev proxy will forward to backend
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim(), style }),
      });

      // Be defensive: proxy/server errors can return empty or non-JSON bodies
      const contentType = response.headers.get("content-type") || "";
      let data = null;
      let raw = "";
      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (_) {
          // Swallow JSON parse errors here; we'll handle as empty body below
          data = null;
        }
      } else {
        try {
          raw = await response.text();
          if (raw) {
            try {
              data = JSON.parse(raw);
            } catch (_) {
              // Not JSON; leave as raw text
            }
          }
        } catch (_) {
          // ignore
        }
      }

      if (!response.ok) {
        const message =
          (data && data.error) || raw || `Request failed (${response.status})`;
        throw new Error(message);
      }

      if (!data) {
        throw new Error("Empty response from server. Please try again.");
      }

      setResult(data);
    } catch (err) {
      // Network errors (CORS, server down) often surface as TypeError in fetch
      const isNetworkError =
        err?.name === "TypeError" || /fetch|network/i.test(err?.message || "");
      const message = isNetworkError
        ? "Could not reach the server. Make sure the backend is running."
        : err?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Grammar & Style <span className="text-indigo-600">Enhancer</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform your text with AI-powered grammar correction and style
            enhancement. Choose from different writing styles to match your
            needs.
          </p>
        </div>

        {/* Style Selection Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {styles.map((styleOption) => (
            <button
              key={styleOption.value}
              onClick={() => setStyle(styleOption.value)}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                style === styleOption.value
                  ? styleOption.color
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              } ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md transform hover:-translate-y-0.5"
              }`}
            >
              {styleOption.label}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Input Section */}
          <div className="mb-6">
            <label
              htmlFor="text-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter your text to enhance
            </label>
            <div className="relative">
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 p-4 rounded-xl resize-none transition-all duration-200 bg-gray-900 text-gray-100 placeholder-gray-400 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-inner"
                disabled={loading}
                maxLength={2000}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {charCount}/2000
              </div>
            </div>
          </div>

          {/* Style Selection Cards */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose enhancement style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((styleOption) => (
                <button
                  key={styleOption.value}
                  onClick={() => setStyle(styleOption.value)}
                  disabled={loading}
                  className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 ${
                    style === styleOption.value
                      ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg scale-[1.02]"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                  } ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl"
                  }`}
                >
                  <span className="text-2xl">{styleOption.icon}</span>
                  <span className="text-sm font-semibold">
                    {styleOption.label}
                  </span>
                  <span className="text-xs opacity-80 text-center leading-tight">
                    {styleOption.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleEnhance}
              disabled={loading || !text.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Enhancing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Enhance Text
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-4 bg-gray-800 text-gray-100 font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            >
              Clear
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-red-700 text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Result Section */}
          {result && <ResultCard result={result} />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Powered by OpenRouter AI • Built with React & TailwindCSS
        </div>
      </div>
    </div>
  );
}

export default App;
