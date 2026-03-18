import { FileSearch, Users, Brain, BarChart3, Workflow, Lightbulb, Mic, Volume2 } from "lucide-react";
import useInView from "@/hooks/useInView";

const features = [
  { icon: FileSearch, title: "AI Resume Screening", desc: "Process thousands of resumes in seconds. Our LLM engine reads between the lines — spotting potential, not just keywords." },
  { icon: Users, title: "Semantic Candidate Matching", desc: "Goes beyond keyword filters. Understands skills, context, career trajectory, and cultural fit to surface the right people." },
  { icon: Brain, title: "AI Interview Intelligence", desc: "Auto-generate role-specific interview questions and get AI-scored candidate responses before the first call." },
  { icon: BarChart3, title: "Smart Candidate Ranking", desc: "Every candidate gets a transparent AI score with reasoning — so your team makes confident, bias-free decisions fast." },
  { icon: Workflow, title: "End-to-End Workflow Automation", desc: "From job posting to offer letter — automate every repetitive step and let your team focus on the humans, not the admin." },
  { icon: Lightbulb, title: "Talent Market Intelligence", desc: "Real-time salary benchmarks, skill supply data, and competitor hiring trends — so you always hire with an edge." },
  { icon: Mic, title: "Speech to Text", desc: "Transcribe candidate interviews, screening calls, and voice notes instantly with 97%+ accuracy across 9+ languages." },
  { icon: Volume2, title: "Text to Speech", desc: "Turn job descriptions, AI feedback, and reports into natural-sounding audio — perfect for candidate outreach at scale." },
];

const Features = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-16">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Platform
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            One Platform.{" "}<span className="text-primary">Every Hiring Decision</span>{" "}Covered.
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            From the first resume to the final offer — Hyrex AI automates the entire recruiting lifecycle with intelligence that understands your standards.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const { ref, isInView } = useInView(0.15);
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={`group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-600 transition-all duration-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-300">
        <Icon className="text-primary" size={22} />
      </div>
      <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
    </div>
  );
};

export default Features;
