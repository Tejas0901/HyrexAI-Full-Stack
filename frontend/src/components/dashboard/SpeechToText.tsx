import { useState, useRef } from "react";
import { Mic, Upload, Copy, Check, ChevronDown } from "lucide-react";

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Bengali", "Gujarati", "Marathi", "Punjabi",
];

const DEMO_TRANSCRIPT =
  "The candidate demonstrated strong technical skills in machine learning and Python development. " +
  "They described their experience building NLP pipelines at scale, including transformer-based models for text classification. " +
  "They mentioned familiarity with AWS SageMaker and MLflow for model deployment and experiment tracking. " +
  "Overall communication was clear and structured, with concrete examples throughout the interview.";

type Phase = "idle" | "uploading" | "transcribing" | "done";

const SpeechToText = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleTranscribe = () => {
    if (phase !== "idle") return;
    setPhase("uploading");
    setTranscript("");
    setProgress(0);

    // Simulate upload
    setTimeout(() => {
      setPhase("transcribing");
      let p = 0;
      const interval = setInterval(() => {
        p += 3;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(interval);
          // Simulate word-by-word reveal
          const words = DEMO_TRANSCRIPT.split(" ");
          let i = 0;
          const wordInterval = setInterval(() => {
            i += 3;
            setTranscript(words.slice(0, i).join(" "));
            if (i >= words.length) {
              clearInterval(wordInterval);
              setPhase("done");
            }
          }, 40);
        }
      }, 30);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPhase("idle");
    setTranscript("");
    setFileName("");
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Speech to Text</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Transcribe audio files with high accuracy using our AI speech recognition engine.
        </p>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          Demo mode — click "Transcribe" to see a simulated transcription. Connect your API key for live audio processing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Input */}
        <div className="space-y-4">
          {/* Upload area */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Audio Input</h2>

            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload size={22} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {fileName || "Drop audio file here"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                MP3, WAV, M4A, FLAC up to 100MB
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
            </div>

            {/* Mic button */}
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-primary hover:text-primary transition-colors">
              <Mic size={16} />
              Record from microphone
            </button>
          </div>

          {/* Language + Transcribe */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block mb-2">Language</label>
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:border-primary transition-colors"
                >
                  {language}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {langOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLanguage(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          l === language ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {phase === "transcribing" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-primary font-medium">Transcribing audio...</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {phase !== "transcribing" && (
              <button
                onClick={phase === "done" ? handleReset : handleTranscribe}
                disabled={phase === "uploading"}
                className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              >
                {phase === "uploading" ? "Uploading..." : phase === "done" ? "Transcribe Again" : "Transcribe"}
              </button>
            )}
          </div>
        </div>

        {/* Right — Results */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Transcript</h2>
            {phase === "done" && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[200px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed overflow-y-auto">
            {transcript || (
              <span className="text-gray-400 dark:text-gray-600">
                Transcript will appear here after processing...
              </span>
            )}
            {(phase === "transcribing") && (
              <span className="inline-block w-0.5 h-4 bg-primary animate-glow-pulse ml-0.5 align-middle" />
            )}
          </div>

          {phase === "done" && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Words</p>
                <p className="text-base font-bold text-primary">{wordCount}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{language}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">97.4%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
