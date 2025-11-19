import React, { useState } from "react";
import { axiosInstance } from "@/api";
import { toast } from "react-toastify";

const TripAIAssistant = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!input) return toast.error("Please enter some trip preferences");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/ai/suggest", { prompt: input });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      toast.error("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 backdrop-blur-sm">
        {/* Elegant Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 p-8">
          <div className="absolute inset-0 opacity-20"></div>
          <div className="relative flex items-center gap-6">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="text-4xl">🗺️</div>
            </div>
            <div>
              <h1 className="text-3xl font-light text-white tracking-wide mb-2">
                AI Travel Curator
              </h1>
              <p className="text-slate-300 text-lg font-light">
                Discover extraordinary destinations tailored to your vision
              </p>
            </div>
          </div>
        </div>

        {/* Refined Content Area */}
        <div className="p-8">
          <div className="mb-8">
            <label className="block text-gray-800 font-medium mb-4 text-lg">
              Tell us about your ideal journey
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I'm looking for a romantic getaway in Europe this fall, budget around $3000 for two people, love historic cities and cozy cafes..."
                rows="5"
                className="w-full border-2 border-gray-200 rounded-2xl p-6 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-slate-400 resize-none transition-all duration-300 text-base leading-relaxed shadow-sm hover:border-gray-300"
              />
              <div className="absolute bottom-4 right-6 text-sm text-gray-400 font-light">
                {input.length} chars
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleSuggest}
              disabled={loading || !input.trim()}
              className={`group relative px-12 py-4 rounded-2xl font-medium flex items-center gap-3 transition-all duration-300 transform ${
                loading || !input.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-slate-800 text-white hover:bg-slate-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-base">Crafting Your Journey...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">✨</span>
                    <span className="text-base tracking-wide">Curate My Trip</span>
                    <span className="text-sm opacity-75">→</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Sophisticated Results Section */}
          {suggestions && (
            <div className="mt-8 animate-in slide-in-from-bottom fade-in duration-700">
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <span className="text-slate-600 text-lg">📋</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-gray-800 tracking-wide">
                        Your Curated Itinerary
                      </h2>
                      <p className="text-gray-500 text-sm font-light">
                        Personalized recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(suggestions)}
                      className="px-4 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                    >
                      <span className="text-slate-600">📄</span>
                      <span className="text-gray-700 font-medium">Copy</span>
                    </button>
                    <button
                      onClick={() => {
                        setSuggestions("");
                        setInput("");
                      }}
                      className="px-4 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                    >
                      <span className="text-slate-600">↻</span>
                      <span className="text-gray-700 font-medium">Reset</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="prose prose-gray max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-base tracking-wide">
                        {suggestions}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refined Footer */}
          <div className="text-center mt-8 py-4">
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-sm font-light tracking-wider">AI POWERED</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-light tracking-wider">CURATED EXPERIENCES</span>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripAIAssistant;