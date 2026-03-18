import { useState } from "react";
import useInView from "@/hooks/useInView";

const tabs = ["Resume Analysis", "Candidate Ranking", "AI Insights"] as const;
type Tab = typeof tabs[number];

const candidates = [
  { name: "Sarah Johnson", score: 97, skills: ["Python", "LLMs", "NLP"], exp: "6 years", rec: "Exceptional fit — led 3 production LLM deployments at scale." },
  { name: "Marcus Rivera", score: 93, skills: ["TensorFlow", "MLOps", "AWS"], exp: "5 years", rec: "Strong ML engineer with solid cloud deployment track record." },
  { name: "Aisha Patel", score: 89, skills: ["Transformers", "Python", "K8s"], exp: "4 years", rec: "High-potential candidate — ready for a senior ML role with mentoring." },
];

const insights = [
  { label: "Qualified Pipeline", value: "347", desc: "Active candidates matched to this role right now" },
  { label: "Avg. Time to Shortlist", value: "4.1 min", desc: "vs. 3–5 days manual screening average" },
  { label: "Market Skill Gap", value: "MLOps", desc: "Critical shortage — consider upskilling existing team" },
  { label: "Salary Benchmark", value: "$172K", desc: "P50 for Senior ML Engineer, San Francisco" },
];

const ProductDemo = () => {
  const { ref, isInView } = useInView();
  const [activeTab, setActiveTab] = useState<Tab>("Resume Analysis");

  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-16">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Product
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Your <span className="text-primary">Hiring Command Center</span>
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            One dashboard where your team screens, ranks, and decides — with AI doing the heavy lifting so you focus on the conversation, not the spreadsheet.
          </p>
        </header>

        <div className={`max-w-5xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <div className="ml-4 flex-1 h-7 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center px-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">app.hyrex.ai/dashboard</span>
            </div>
          </div>

          <div className="p-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Active Roles" value="24" change="+3 opened this week" />
              <StatCard label="Candidates Screened" value="18,340" change="+2,100 in last 24h" />
              <StatCard label="Avg. Match Accuracy" value="96.8%" change="↑ 3.2% vs last month" />
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-200 dark:border-gray-700 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Resume Analysis" && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="text-sm font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  AI-Ranked Shortlist — Senior ML Engineer
                </div>
                {candidates.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-primary">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                        <div className="flex gap-1.5 mt-1">
                          {c.skills.map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-primary font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-heading font-bold text-primary">{c.score}%</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500">Match</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Candidate Ranking" && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="text-sm font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  AI Ranking with Transparent Reasoning
                </div>
                {candidates.map((c, i) => (
                  <div key={c.name} className="flex items-start gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-sm font-bold text-primary">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{c.exp}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{c.rec}</p>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "AI Insights" && (
              <div className="grid grid-cols-2 gap-4">
                {insights.map((ins) => (
                  <div key={ins.label} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-medium uppercase tracking-wide">{ins.label}</div>
                    <div className="text-lg font-heading font-bold text-gray-900 dark:text-gray-100 mb-1">{ins.value}</div>
                    <div className="text-xs text-primary font-medium">{ins.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, change }: { label: string; value: string; change: string }) => (
  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{label}</div>
    <div className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">{value}</div>
    <div className="text-xs text-primary mt-1 font-medium">{change}</div>
  </div>
);

export default ProductDemo;
