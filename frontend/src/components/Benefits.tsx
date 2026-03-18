import useInView from "@/hooks/useInView";
import { useEffect, useState, useRef } from "react";
import { Zap, Eye, Target, Brain } from "lucide-react";

const stats = [
  { icon: Zap, value: 10, suffix: "x", label: "Faster Candidate Screening", desc: "What takes days manually happens in minutes" },
  { icon: Eye, value: 87, suffix: "%", label: "Reduction in Manual Review", desc: "Your team touches only the candidates that matter" },
  { icon: Target, value: 96, suffix: "%", label: "AI Match Accuracy", desc: "Validated against 50,000+ real hiring outcomes" },
  { icon: Brain, value: 3, suffix: "x", label: "More Offers Accepted", desc: "Better-fit candidates say yes more often" },
];

const Benefits = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="benefits" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-16">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Results
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Numbers That Change{" "}<span className="text-primary">How You Hire</span>
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Real outcomes from recruitment teams who replaced manual screening with Hyrex AI — measured, verified, repeatable.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <StatCounter key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCounter = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  const { ref, isInView } = useInView(0.3);
  const [count, setCount] = useState(0);
  const animated = useRef(false);
  const Icon = stat.icon;

  useEffect(() => {
    if (isInView && !animated.current) {
      animated.current = true;
      const duration = 1500;
      const steps = 40;
      const increment = stat.value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }
  }, [isInView, stat.value]);

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-sm hover:shadow-md dark:hover:border-gray-600 transition-all duration-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="h-10 w-10 mx-auto rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
        <Icon className="text-primary" size={20} />
      </div>
      <div className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-1">
        {count}{stat.suffix}
      </div>
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500">{stat.desc}</div>
    </div>
  );
};

export default Benefits;
