import { useState, useEffect } from "react";
import {
  LayoutDashboard, Mic, Volume2, AudioLines, FileSearch, Users, MessageSquare,
  Key, LogOut, Sun, Moon, Menu, X, ChevronRight, CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type DashboardTab =
  | "overview"
  | "speech-to-text"
  | "text-to-speech"
  | "voice-clone"
  | "resume"
  | "matching"
  | "interview"
  | "api-keys"
  | "billing";

const navItems = [
  { id: "overview" as DashboardTab, label: "Overview", icon: LayoutDashboard },
  { id: "speech-to-text" as DashboardTab, label: "Speech to Text", icon: Mic },
  { id: "text-to-speech" as DashboardTab, label: "Text to Speech", icon: Volume2 },
  { id: "voice-clone" as DashboardTab, label: "Voice Clone", icon: AudioLines },
  { id: "resume" as DashboardTab, label: "Resume Screening", icon: FileSearch },
  { id: "matching" as DashboardTab, label: "Candidate Matching", icon: Users, soon: true },
  { id: "interview" as DashboardTab, label: "Interview Insights", icon: MessageSquare, soon: true },
  { id: "api-keys" as DashboardTab, label: "API Keys", icon: Key },
  { id: "billing" as DashboardTab, label: "Billing", icon: CreditCard },
];

interface Props {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const DashboardSidebar = ({ activeTab, onTabChange }: Props) => {
  const { user, signOut } = useAuth();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <a href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading font-bold text-xs text-white">H</span>
          </div>
          <span className="font-heading font-bold text-base text-gray-900 dark:text-gray-100">
            Hyrex <span className="text-primary">AI</span>
          </span>
        </a>
        <button
          onClick={() => setIsDark(!isDark)}
          className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 mb-3">
          Features
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!item.soon) {
                  onTabChange(item.id);
                  setMobileOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950 text-primary"
                  : item.soon
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {/* Active indicator */}
              <span className={`absolute left-0 w-0.5 h-6 rounded-r-full bg-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.soon && (
                <span className="text-[9px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 px-1.5 py-0.5 rounded-full">
                  SOON
                </span>
              )}
              {isActive && <ChevronRight size={14} className="text-primary opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-100 dark:bg-blue-950 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 truncate">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={() => { signOut(); window.location.href = "/"; }}
            className="text-gray-400 dark:text-gray-600 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 h-9 w-9 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-400"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile slide-in */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-60 z-40 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar — desktop fixed */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-20">
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;
