import { useState, useEffect, useRef } from "react";
import { Play, Square, Download } from "lucide-react";

const VOICES = [
  { id: "aria", name: "Aria", gender: "Female", accent: "American", initials: "AR" },
  { id: "marcus", name: "Marcus", gender: "Male", accent: "British", initials: "MA" },
  { id: "priya", name: "Priya", gender: "Female", accent: "Indian", initials: "PR" },
  { id: "james", name: "James", gender: "Male", accent: "American", initials: "JA" },
  { id: "nisha", name: "Nisha", gender: "Female", accent: "Indian", initials: "NI" },
  { id: "leo", name: "Leo", gender: "Male", accent: "Australian", initials: "LE" },
];

const MAX_CHARS = 500;

type Phase = "idle" | "generating" | "done";

const BAR_COUNT = 32;

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [speed, setSpeed] = useState(1.0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(4));
  const animRef = useRef<ReturnType<typeof setInterval>>();

  const animateBars = (active: boolean) => {
    clearInterval(animRef.current);
    if (!active) {
      setBars(Array(BAR_COUNT).fill(4));
      return;
    }
    animRef.current = setInterval(() => {
      setBars(prev =>
        prev.map((_, i) => {
          const center = BAR_COUNT / 2;
          const dist = Math.abs(i - center) / center;
          const base = (1 - dist) * 32;
          return Math.max(4, base + Math.random() * 20 - 10);
        })
      );
    }, 80);
  };

  useEffect(() => {
    return () => clearInterval(animRef.current);
  }, []);

  const handleGenerate = () => {
    if (phase === "generating") return;
    setPhase("generating");
    setIsPlaying(false);
    animateBars(false);

    setTimeout(() => {
      setPhase("done");
      setIsPlaying(true);
      animateBars(true);
      // Auto-stop after 4s demo
      setTimeout(() => {
        setIsPlaying(false);
        animateBars(false);
      }, 4000);
    }, 1800);
  };

  const handlePlayPause = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    animateBars(next);
  };

  const handleStop = () => {
    setIsPlaying(false);
    animateBars(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Text to Speech</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Convert text to natural-sounding audio with multiple voice options.
        </p>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          Demo mode — click "Generate Audio" to see an animated preview. Connect your API key for real audio synthesis.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Input */}
        <div className="space-y-4">
          {/* Text input */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Text</label>
              <span className={`text-xs font-medium ${text.length > MAX_CHARS * 0.9 ? "text-red-500" : "text-gray-400 dark:text-gray-600"}`}>
                {text.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Enter text to convert to speech..."
              rows={6}
              className="w-full resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Voice selector */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Voice</h2>
            <div className="grid grid-cols-3 gap-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 ${
                    selectedVoice === v.id
                      ? "border-primary bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedVoice === v.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {v.initials}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-semibold ${selectedVoice === v.id ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}>
                      {v.name}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600">{v.accent}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Speed</h2>
              <span className="text-sm font-bold text-primary">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={phase === "generating"}
            className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
          >
            {phase === "generating" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : "Generate Audio"}
          </button>
        </div>

        {/* Right — Audio player */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Audio Output</h2>

          {/* Waveform */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center min-h-[180px] px-4 mb-4">
            {phase === "idle" ? (
              <p className="text-sm text-gray-400 dark:text-gray-600">Audio will appear here after generation</p>
            ) : phase === "generating" ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-primary font-medium">Synthesizing speech...</p>
              </div>
            ) : (
              <div className="flex items-end gap-0.5 h-16 w-full justify-center">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-75 ${isPlaying ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          {phase === "done" && (
            <>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={handlePlayPause}
                  className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {isPlaying ? <Square size={18} className="fill-white" /> : <Play size={18} className="fill-white ml-0.5" />}
                </button>
                <button
                  onClick={handleStop}
                  className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <Square size={14} />
                </button>
                <button className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <Download size={14} />
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-600">Voice</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{selectedVoice}</p>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-600">Speed</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{speed.toFixed(1)}x</p>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-600">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">~{Math.ceil((text || "sample text").split(" ").length / (speed * 2))}s</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
