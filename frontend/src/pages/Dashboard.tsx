import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar, { type DashboardTab } from "@/components/dashboard/DashboardSidebar";
import DashboardHome from "@/components/dashboard/DashboardHome";
import SpeechToText from "@/components/dashboard/SpeechToText";
import TextToSpeech from "@/components/dashboard/TextToSpeech";
import ResumeScreening from "@/components/dashboard/ResumeScreening";
import ApiKeys from "@/components/dashboard/ApiKeys";
import { Users, MessageSquare } from "lucide-react";

const PAGE_TITLES: Record<DashboardTab, string> = {
  "overview": "Overview",
  "speech-to-text": "Speech to Text",
  "text-to-speech": "Text to Speech",
  "resume": "Resume Screening",
  "matching": "Candidate Matching",
  "interview": "Interview Insights",
  "api-keys": "API Keys",
};

const ComingSoon = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
      <Icon size={28} className="text-primary" />
    </div>
    <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
      This feature is currently in development and will be available soon. Stay tuned!
    </p>
    <span className="mt-4 text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900">
      Coming Soon
    </span>
  </div>
);

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":       return <DashboardHome onTabChange={setActiveTab} />;
      case "speech-to-text": return <SpeechToText />;
      case "text-to-speech": return <TextToSpeech />;
      case "resume":         return <ResumeScreening />;
      case "api-keys":       return <ApiKeys />;
      case "matching":       return <ComingSoon title="Candidate Matching" icon={Users} />;
      case "interview":      return <ComingSoon title="Interview Insights" icon={MessageSquare} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content — offset by sidebar width */}
      <div className="md:ml-60 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 h-16 flex items-center">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-10 md:ml-0">
            {PAGE_TITLES[activeTab]}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
