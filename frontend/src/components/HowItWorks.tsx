import useInView from "@/hooks/useInView";
import { FileUp, Brain, Layers, Trophy, Zap } from "lucide-react";

const steps = [
  { icon: FileUp, label: "Ingest Any Source", desc: "Upload resumes, LinkedIn exports, or ATS data — we handle every format" },
  { icon: Brain, label: "Deep LLM Analysis", desc: "Our AI reads skills, context, career arc, and cultural signals simultaneously" },
  { icon: Layers, label: "Semantic Skill Mapping", desc: "Extracts 40+ signals per candidate — far beyond what a keyword filter can see" },
  { icon: Trophy, label: "Ranked Shortlist", desc: "Top candidates surfaced with AI scores, confidence levels, and transparent reasoning" },
  { icon: Zap, label: "Instant Hiring Actions", desc: "Interview questions, outreach drafts, and offer benchmarks — all ready to go" },
];

const HowItWorks = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-20">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            How It Works
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            1,000 Applicants to Your{" "}<span className="text-primary">Top 5</span>{" "}in Minutes
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Our AI pipeline does in seconds what takes your team days — with complete transparency at every step, no black boxes.
          </p>
        </header>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gray-200 dark:bg-gray-700">
            <div className={`h-full bg-primary transition-all duration-[2000ms] origin-left ${isInView ? "scale-x-100" : "scale-x-0"}`} />
          </div>
          {/* Connecting line - mobile */}
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700">
            <div className={`w-full bg-primary transition-all duration-[2000ms] ${isInView ? "h-full" : "h-0"}`} />
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-0">
            {steps.map((step, i) => (
              <PipelineNode key={step.label} step={step} index={i} parentInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PipelineNode = ({ step, index, parentInView }: { step: typeof steps[0]; index: number; parentInView: boolean }) => {
  const Icon = step.icon;

  return (
    <div
      className={`relative flex lg:flex-col items-center lg:items-center gap-4 lg:gap-3 pl-16 lg:pl-0 transition-all duration-700 ${parentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 400}ms` }}
    >
      <div className="absolute left-2 lg:relative lg:left-auto flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
        <Icon className="text-white" size={20} />
      </div>
      <div className="lg:text-center">
        <div className="text-sm font-heading font-semibold text-gray-900 dark:text-gray-100">{step.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.desc}</div>
      </div>
    </div>
  );
};

export default HowItWorks;
