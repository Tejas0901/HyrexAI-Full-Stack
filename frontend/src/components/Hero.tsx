import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useInView from "@/hooks/useInView";

const EXAMPLE_INPUT = "Senior ML Engineer — 6 yrs, Python, TensorFlow, AWS, led 3 production LLM deployments.";

const RESULTS = {
  matchScore: 97,
  skills: ["Python", "TensorFlow", "AWS"],
  experienceLevel: "Senior / Lead",
  roleFit: "ML Engineering Lead",
  interviewQuestions: [
    "Walk me through a production LLM deployment you owned end-to-end.",
    "How do you approach model monitoring and drift detection at scale?",
  ],
};

const PARTNER_LOGOS = [
  "Greenhouse", "Lever", "Workday", "BambooHR", "LinkedIn",
  "Indeed", "Slack", "SAP", "iCIMS", "Bullhorn",
];

type DemoPhase = "idle" | "typing" | "analyzing" | "results";

const Hero = () => {
  const { ref, isInView } = useInView();
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [typedInput, setTypedInput] = useState("");
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const phaseRef = useRef<DemoPhase>("idle");

  const runAnimation = () => {
    phaseRef.current = "typing";
    setPhase("typing");
    setTypedInput("");
    setAnalyzeProgress(0);
    setShowResults(false);

    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setTypedInput(EXAMPLE_INPUT.slice(0, i));
      if (i >= EXAMPLE_INPUT.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          phaseRef.current = "analyzing";
          setPhase("analyzing");
          let p = 0;
          const analyzeInt = setInterval(() => {
            p += 2;
            setAnalyzeProgress(Math.min(p, 100));
            if (p >= 100) {
              clearInterval(analyzeInt);
              phaseRef.current = "results";
              setPhase("results");
              setShowResults(true);
            }
          }, 30);
        }, 400);
      }
    }, 35);
  };

  useEffect(() => {
    if (isInView && phaseRef.current === "idle") {
      const t = setTimeout(runAnimation, 1200);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  const resetDemo = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    phaseRef.current = "idle";
    setPhase("idle");
    setTypedInput("");
    setAnalyzeProgress(0);
    setShowResults(false);
    setTimeout(runAnimation, 600);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-200"
      aria-label="Hyrex AI Hero"
    >
      <div ref={ref} className="w-full container mx-auto px-4 pt-24 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 px-4 py-1.5 rounded-full mb-8">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Now in Beta &nbsp;·&nbsp; Trusted by 500+ Hiring Teams</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] text-gray-900 dark:text-gray-100 mb-6">
              Stop Sorting Resumes.{" "}
              <span className="text-primary">Start Hiring</span>{" "}
              Top Talent.
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-10 leading-relaxed">
              Hyrex AI reads thousands of applications, ranks your best candidates in seconds, and tells you exactly who to interview — powered by state-of-the-art large language models.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link to="/dashboard" className="btn-gradient px-8 py-3.5 rounded-xl text-base font-semibold text-white">
                Try Hyrex AI Free
              </Link>
              <a href="#features" className="btn-glass px-8 py-3.5 rounded-xl text-base font-semibold">
                See How It Works
              </a>
            </div>

            <p className="mt-5 text-xs text-gray-400 dark:text-gray-600">No credit card required &nbsp;·&nbsp; Setup in under 2 minutes</p>
          </div>

          {/* Right - Demo card */}
          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] text-gray-400 dark:text-gray-500 font-mono">hyrex.ai / candidate-analysis</span>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">
                    Describe the role or paste a candidate profile
                  </label>
                  <div
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-h-[60px] font-mono text-sm text-gray-800 dark:text-gray-200"
                    aria-live="polite"
                    role="status"
                  >
                    {typedInput}
                    {phase === "typing" && (
                      <span className="inline-block w-0.5 h-4 bg-primary animate-glow-pulse ml-0.5 align-middle" aria-hidden="true" />
                    )}
                    {phase === "idle" && <span className="text-gray-400 dark:text-gray-600">e.g. "Senior ML Engineer, 6 yrs Python, TensorFlow..."</span>}
                  </div>
                </div>

                {phase === "analyzing" && (
                  <div className="space-y-3" aria-live="polite">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-primary font-medium">Running AI analysis across 40+ signals...</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-100" style={{ width: `${analyzeProgress}%` }} />
                    </div>
                  </div>
                )}

                {showResults && (
                  <div className="space-y-3" aria-live="polite">
                    <div className="grid grid-cols-2 gap-3">
                      <ResultItem label="Match Score" value={`${RESULTS.matchScore}%`} highlight />
                      <ResultItem label="Experience" value={RESULTS.experienceLevel} />
                      <ResultItem label="Role Fit" value={RESULTS.roleFit} />
                      <ResultItem label="Key Skills" value={RESULTS.skills.join(", ")} />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-3 mt-3">
                      <div className="text-[11px] text-primary mb-2 font-semibold">AI-Tailored Interview Questions</div>
                      {RESULTS.interviewQuestions.map((q, i) => (
                        <div key={i} className="text-xs text-gray-600 dark:text-gray-400 py-1.5 border-b border-blue-100 dark:border-blue-900 last:border-0">
                          {i + 1}. {q}
                        </div>
                      ))}
                    </div>
                    <button onClick={resetDemo} className="text-xs text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium">
                      ↻ Run again
                    </button>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Logo carousel */}
      <div className="w-full pb-16 mt-4">
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 font-medium uppercase tracking-widest mb-6">
          Integrates with the tools your team already uses
        </p>
        <div className="overflow-hidden carousel-mask">
          <div className="flex animate-carousel gap-8 w-max">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((name, i) => (
              <div key={i} className="flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-3 min-w-[120px] shadow-sm">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ResultItem = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">{label}</div>
    <div className={`text-sm font-heading font-semibold ${highlight ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}>
      {value}
    </div>
  </div>
);

export default Hero;
