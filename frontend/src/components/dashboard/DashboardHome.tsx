import { Mic, Volume2, AudioLines, FileSearch, Key, TrendingUp, Activity, Zap, ArrowRight } from "lucide-react";
import type { DashboardTab } from "./DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  { label: "API Calls Today", value: "1,240", change: "+12% from yesterday", icon: Activity, color: "text-blue-500" },
  { label: "Characters Processed", value: "284K", change: "+8% this week", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Avg. Accuracy", value: "98.2%", change: "Across all models", icon: Zap, color: "text-violet-500" },
];

const quickStart = [
  {
    id: "speech-to-text" as DashboardTab,
    icon: Mic,
    title: "Speech to Text",
    desc: "Transcribe audio files or live mic input with high accuracy.",
    color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  },
  {
    id: "text-to-speech" as DashboardTab,
    icon: Volume2,
    title: "Text to Speech",
    desc: "Convert text to natural-sounding audio with multiple voices.",
    color: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
  },
  {
    id: "voice-clone" as DashboardTab,
    icon: AudioLines,
    title: "Voice Clone",
    desc: "Clone your voice and use it across all speech features.",
    color: "bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400",
  },
  {
    id: "resume" as DashboardTab,
    icon: FileSearch,
    title: "Resume Screening",
    desc: "AI-powered resume analysis and candidate ranking.",
    color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "api-keys" as DashboardTab,
    icon: Key,
    title: "API Keys",
    desc: "Manage your API keys and access credentials.",
    color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
];

const recentActivity = [
  { action: "Speech to Text", detail: "interview_recording.mp3 transcribed", time: "2 min ago", status: "success" },
  { action: "Text to Speech", detail: "Job description converted — Aria voice", time: "18 min ago", status: "success" },
  { action: "Resume Screening", detail: "15 resumes analyzed for ML Engineer role", time: "1 hr ago", status: "success" },
  { action: "API Key Created", detail: "Production key hx_prod_****8f2a", time: "3 hrs ago", status: "info" },
  { action: "Speech to Text", detail: "candidate_call.wav transcribed", time: "Yesterday", status: "success" },
];

interface Props {
  onTabChange: (tab: DashboardTab) => void;
}

const DashboardHome = ({ onTabChange }: Props) => {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your Hyrex AI account today.
        </p>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          Demo mode — all stats and features use sample data. Connect your API key to use live functionality.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <Icon size={16} className={s.color} />
              </div>
              <p className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Start */}
      <div>
        <h2 className="text-base font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Start
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickStart.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md dark:hover:border-gray-600 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all mt-0.5 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-base font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  item.status === "success" ? "bg-emerald-400" : "bg-blue-400"
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
