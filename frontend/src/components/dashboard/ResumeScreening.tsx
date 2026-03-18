import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

const DEMO_RESULTS = [
  {
    name: "Sarah Johnson",
    score: 94,
    exp: "6 years",
    skills: ["Python", "ML", "NLP", "TensorFlow"],
    rec: "Highly Recommended",
    recColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950",
    summary: "Strong ML background with hands-on NLP experience. Ideal for the role.",
  },
  {
    name: "Marcus Rivera",
    score: 91,
    exp: "5 years",
    skills: ["TensorFlow", "AWS", "NLP", "Python"],
    rec: "Recommended",
    recColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
    summary: "Solid ML engineer with cloud deployment experience. Good culture fit.",
  },
  {
    name: "Aisha Patel",
    score: 88,
    exp: "4 years",
    skills: ["Transformers", "Python", "Kubernetes"],
    rec: "Consider",
    recColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
    summary: "Good technical foundation. May need mentoring for senior-level responsibilities.",
  },
  {
    name: "David Chen",
    score: 72,
    exp: "3 years",
    skills: ["Python", "SQL", "Scikit-learn"],
    rec: "Consider",
    recColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
    summary: "Junior-to-mid level profile. Better suited for a mid-level ML role.",
  },
];

type Phase = "idle" | "analyzing" | "done";

const ResumeScreening = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleAnalyze = () => {
    if (phase !== "idle") return;
    setPhase("analyzing");
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 300);
      }
    }, 40);
  };

  const handleReset = () => {
    setPhase("idle");
    setProgress(0);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Resume Screening</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered resume analysis and candidate ranking against your job requirements.
        </p>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          Demo mode — click "Analyze" to see AI-generated candidate results. Connect your API key for live resume processing.
        </p>
      </div>

      {phase !== "done" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Upload Resumes</h2>
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload size={22} className="text-primary" />
              </div>
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText size={14} className="text-primary" />
                  <p className="text-sm font-medium text-primary">{fileName}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Drop resumes here</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">PDF, DOCX, TXT — multiple files supported</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Description</h2>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here to match candidates against it..."
              rows={8}
              className="w-full resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      ) : null}

      {/* Analyzing progress */}
      {phase === "analyzing" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-primary">Analyzing resumes with AI...</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Extracting skills, scoring candidates, and generating recommendations...
          </p>
        </div>
      )}

      {/* Analyze button */}
      {phase !== "analyzing" && phase !== "done" && (
        <button
          onClick={handleAnalyze}
          className="btn-gradient px-8 py-3 rounded-xl text-sm font-semibold text-white"
        >
          Analyze Resumes
        </button>
      )}

      {/* Results */}
      {phase === "done" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <h2 className="text-base font-heading font-semibold text-gray-900 dark:text-gray-100">
                Analysis Complete — {DEMO_RESULTS.length} Candidates Ranked
              </h2>
            </div>
            <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              Screen New Resumes
            </button>
          </div>

          <div className="space-y-3">
            {DEMO_RESULTS.map((c, i) => (
              <div
                key={c.name}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-primary">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</h3>
                        <span className="text-xs text-gray-400 dark:text-gray-600">{c.exp} exp</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.recColor}`}>
                          {c.rec}
                        </span>
                      </div>
                      <span className="text-lg font-heading font-bold text-primary">{c.score}%</span>
                    </div>
                    {/* Score bar */}
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {c.skills.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-primary font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScreening;
