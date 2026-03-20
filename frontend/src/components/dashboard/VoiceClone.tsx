import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Mic, MicOff, Play, Square, Trash2, Loader2,
  CheckCircle2, Download, Volume2, Pause, RefreshCw,
} from "lucide-react";
import { voiceCloneApi, type VoiceCloneSynthesisListItem } from "@/services/voiceClone";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
  { id: "ta", label: "Tamil" },
  { id: "te", label: "Telugu" },
  { id: "kn", label: "Kannada" },
  { id: "bn", label: "Bengali" },
  { id: "gu", label: "Gujarati" },
  { id: "mr", label: "Marathi" },
  { id: "pa", label: "Punjabi" },
];

const MAX_CHARS = 5000;
const MAX_FILE_SIZE = 50; // MB
const BAR_COUNT = 32;

type Phase = "idle" | "synthesizing" | "done";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fmtDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const fmtFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const VoiceClone = () => {
  /* ---- input state ---- */
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [refDuration, setRefDuration] = useState(0);
  const [targetText, setTargetText] = useState("");
  const [cloneName, setCloneName] = useState("");
  const [language, setLanguage] = useState("en");

  /* ---- synthesis state ---- */
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [synthesisId, setSynthesisId] = useState<string | null>(null);

  /* ---- playback: reference ---- */
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const refAudioRef = useRef<HTMLAudioElement | null>(null);

  /* ---- playback: output ---- */
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(4));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval>>();

  /* ---- recording ---- */
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  /* ---- drag & drop ---- */
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- history ---- */
  const [history, setHistory] = useState<VoiceCloneSynthesisListItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPlayingId, setHistoryPlayingId] = useState<string | null>(null);
  const historyAudioRef = useRef<HTMLAudioElement | null>(null);

  /* ---- load history on mount ---- */
  useEffect(() => {
    loadHistory();
  }, []);

  /* ---- cleanup ---- */
  const referenceUrlRef = useRef(referenceUrl);
  referenceUrlRef.current = referenceUrl;

  useEffect(() => {
    return () => {
      clearInterval(animRef.current);
      clearInterval(timerRef.current);
      audioRef.current?.pause();
      refAudioRef.current?.pause();
      historyAudioRef.current?.pause();
      if (referenceUrlRef.current) URL.revokeObjectURL(referenceUrlRef.current);
    };
  }, []);

  /* ---- helpers ---- */
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const items = await voiceCloneApi.listSyntheses(0, 10);
      setHistory(items);
    } catch {
      // silent — history is optional
    } finally {
      setHistoryLoading(false);
    }
  };

  const animateBars = (active: boolean) => {
    clearInterval(animRef.current);
    if (!active) {
      setBars(Array(BAR_COUNT).fill(4));
      return;
    }
    animRef.current = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          const center = BAR_COUNT / 2;
          const dist = Math.abs(i - center) / center;
          const base = (1 - dist) * 32;
          return Math.max(4, base + Math.random() * 20 - 10);
        })
      );
    }, 80);
  };

  const getAudioDuration = (file: File): Promise<number> =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
        URL.revokeObjectURL(url);
      });
      audio.addEventListener("error", () => {
        resolve(0);
        URL.revokeObjectURL(url);
      });
    });

  /* ---- file handling ---- */
  const setReference = useCallback(async (file: File) => {
    if (!file.type.startsWith("audio/")) return;
    if (file.size > MAX_FILE_SIZE * 1024 * 1024) return;

    // Cleanup previous
    if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    refAudioRef.current?.pause();
    setIsPlayingRef(false);

    const duration = await getAudioDuration(file);
    const url = URL.createObjectURL(file);
    setReferenceFile(file);
    setReferenceUrl(url);
    setRefDuration(duration);
  }, [referenceUrl]);

  const clearReference = () => {
    if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    refAudioRef.current?.pause();
    setReferenceFile(null);
    setReferenceUrl(null);
    setRefDuration(0);
    setIsPlayingRef(false);
  };

  /* ---- reference playback ---- */
  const toggleRefPlayback = () => {
    if (!referenceUrl) return;
    if (isPlayingRef) {
      refAudioRef.current?.pause();
      setIsPlayingRef(false);
    } else {
      const audio = new Audio(referenceUrl);
      refAudioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlayingRef(false));
      audio.play();
      setIsPlayingRef(true);
    }
  };

  /* ---- recording ---- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setRecordTime(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: "audio/webm" });
        await setReference(file);
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordTime((t) => t + 1), 1000);
    } catch {
      // mic permission denied
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  /* ---- drag & drop ---- */
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setReference(file);
  };

  /* ---- synthesize ---- */
  const handleSynthesize = async () => {
    if (!referenceFile || !targetText.trim() || phase === "synthesizing") return;
    setPhase("synthesizing");
    setError(null);
    setSynthesisId(null);
    setIsPlaying(false);
    animateBars(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const result = await voiceCloneApi.synthesize({
        referenceAudio: referenceFile,
        targetText: targetText.trim(),
        cloneName: cloneName.trim() || "Voice Clone",
        language: LANGUAGES.find((l) => l.id === language)?.label || "English",
      });
      setSynthesisId(result.id);
      setPhase("done");

      // Auto-play the result
      const url = voiceCloneApi.getDownloadUrl(result.id);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("play", () => { setIsPlaying(true); animateBars(true); });
      audio.addEventListener("ended", () => { setIsPlaying(false); animateBars(false); });
      audio.addEventListener("pause", () => { setIsPlaying(false); animateBars(false); });
      audio.addEventListener("error", () => { setIsPlaying(false); animateBars(false); });

      await audio.play();

      // Refresh history
      loadHistory();
    } catch (err: unknown) {
      setPhase("idle");
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosErr?.response?.data?.detail ||
        "Failed to synthesize voice. Please try again."
      );
    }
  };

  /* ---- output playback ---- */
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    animateBars(false);
  };

  const handleDownload = () => {
    if (!synthesisId) return;
    const url = voiceCloneApi.getDownloadUrl(synthesisId);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice_clone_${synthesisId}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ---- history playback ---- */
  const playHistoryItem = (id: string) => {
    historyAudioRef.current?.pause();
    if (historyPlayingId === id) {
      setHistoryPlayingId(null);
      return;
    }
    const url = voiceCloneApi.getDownloadUrl(id);
    const audio = new Audio(url);
    historyAudioRef.current = audio;
    setHistoryPlayingId(id);
    audio.addEventListener("ended", () => setHistoryPlayingId(null));
    audio.addEventListener("error", () => setHistoryPlayingId(null));
    audio.play();
  };

  const downloadHistoryItem = (id: string, name: string) => {
    const url = voiceCloneApi.getDownloadUrl(id);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const canSynthesize = !!referenceFile && targetText.trim().length > 0 && phase !== "synthesizing";

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">
          Voice Clone
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload a reference voice sample and enter text to synthesize speech in that voice.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ============================================================ */}
        {/*  LEFT — Input                                                 */}
        {/* ============================================================ */}
        <div className="space-y-4">
          {/* Reference audio upload */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Reference Voice
            </h2>

            {!referenceFile ? (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-primary bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setReference(file);
                      e.target.value = "";
                    }}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      isDragging ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                    }`}>
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {isDragging ? "Drop audio file here" : "Upload reference audio"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600">
                      MP3, WAV, M4A, FLAC, WebM &middot; Up to {MAX_FILE_SIZE}MB
                    </p>
                    <span className="text-xs font-medium text-primary">or click to browse</span>
                  </div>
                </div>

                {/* Record option */}
                <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      Or record directly
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600">
                      Use your microphone
                    </p>
                  </div>
                  {isRecording ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-mono font-semibold text-red-500">
                          {fmtDuration(recordTime)}
                        </span>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <MicOff size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Mic size={14} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Uploaded file preview */
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                <button
                  onClick={toggleRefPlayback}
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  {isPlayingRef ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {referenceFile.name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-600">
                    {fmtDuration(refDuration)} &middot; {fmtFileSize(referenceFile.size)}
                  </p>
                </div>
                {/* Mini waveform */}
                <div className="hidden sm:flex items-end gap-px h-6 flex-shrink-0">
                  {Array.from({ length: 16 }, (_, i) => {
                    const center = 8;
                    const dist = Math.abs(i - center) / center;
                    const h = (1 - dist) * 18 + 4;
                    return (
                      <div
                        key={i}
                        className={`w-0.5 rounded-full ${isPlayingRef ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>
                <button
                  onClick={clearReference}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Target text */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Text to Synthesize
              </label>
              <span className={`text-xs font-medium ${
                targetText.length > MAX_CHARS * 0.9
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-600"
              }`}>
                {targetText.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              value={targetText}
              onChange={(e) => setTargetText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Enter the text you want spoken in the cloned voice..."
              rows={5}
              className="w-full resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Clone name + language */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                Clone Name <span className="text-gray-400 dark:text-gray-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="e.g., My Professional Voice"
                maxLength={100}
                className="w-full text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                Language
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                      language === l.id
                        ? "border-primary bg-blue-50 dark:bg-blue-950 text-primary"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Synthesize button */}
          <button
            onClick={handleSynthesize}
            disabled={!canSynthesize}
            className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
          >
            {phase === "synthesizing" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Synthesizing...
              </span>
            ) : (
              "Synthesize Voice"
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/*  RIGHT — Output                                               */}
        {/* ============================================================ */}
        <div className="space-y-4">
          {/* Audio output */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cloned Audio Output
            </h2>

            {/* Waveform */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center min-h-[180px] px-4 mb-4">
              {phase === "idle" ? (
                <div className="text-center">
                  <Volume2 size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-600">
                    Cloned audio will appear here after synthesis
                  </p>
                </div>
              ) : phase === "synthesizing" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-primary font-medium">
                    Cloning voice & synthesizing...
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">
                    This may take a moment
                  </p>
                </div>
              ) : (
                <div className="flex items-end gap-0.5 h-16 w-full justify-center">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-75 ${
                        isPlaying ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            {phase === "done" && synthesisId && (
              <>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={handlePlayPause}
                    className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {isPlaying ? (
                      <Square size={18} className="fill-white" />
                    ) : (
                      <Play size={18} className="fill-white ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleStop}
                    className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <Square size={14} />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <Download size={14} />
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-600">Voice</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {cloneName || "Voice Clone"}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-600">Language</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {LANGUAGES.find((l) => l.id === language)?.label}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-600">Status</p>
                    <p className="text-sm font-semibold text-emerald-500 flex items-center justify-center gap-1">
                      <CheckCircle2 size={12} />
                      Ready
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tips card */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-5 py-4">
            <h3 className="text-sm font-semibold text-primary mb-2">Tips for best results</h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                Use a clear, noise-free reference audio (10+ seconds recommended)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                Speak naturally and consistently in the reference sample
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                Match the language of the reference audio with the target text
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                Shorter texts (1-3 sentences) produce the most natural results
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  HISTORY                                                      */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-semibold text-gray-900 dark:text-gray-100">
            Recent Syntheses
          </h2>
          <button
            onClick={loadHistory}
            disabled={historyLoading}
            className="text-xs font-medium text-gray-400 dark:text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-8 text-center shadow-sm">
            <p className="text-sm text-gray-400 dark:text-gray-600">
              {historyLoading ? "Loading..." : "No syntheses yet. Create your first voice clone above!"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <button
                  onClick={() => playHistoryItem(item.id)}
                  className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex-shrink-0"
                >
                  {historyPlayingId === item.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.clone_name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-600 truncate">
                    {item.target_text.slice(0, 80)}{item.target_text.length > 80 ? "..." : ""}
                  </p>
                </div>
                <span className="hidden sm:inline text-[10px] font-medium text-gray-400 dark:text-gray-600 flex-shrink-0">
                  {item.language}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                  item.status === "ready"
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900"
                    : item.status === "processing"
                    ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900"
                    : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900"
                }`}>
                  {item.status}
                </span>
                <button
                  onClick={() => downloadHistoryItem(item.id, item.clone_name)}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-primary transition-colors flex-shrink-0"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceClone;
