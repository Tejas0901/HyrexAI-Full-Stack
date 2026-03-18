import useInView from "@/hooks/useInView";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "David Park",
    role: "Head of Talent, Apex Recruiting",
    text: "We used to spend 3 days shortlisting for a single senior role. Hyrex AI does it in under 10 minutes. Our offer acceptance rate went up 40% because the matches are just better.",
    rating: 5,
  },
  {
    name: "Elena Vasquez",
    role: "CEO, TalentBridge",
    text: "The semantic matching is on another level. It caught a candidate our keyword filters would have buried — that person became one of our client's best hires of the year.",
    rating: 5,
  },
  {
    name: "James O'Brien",
    role: "Director, Global Staffing Co.",
    text: "We processed 22,000 applications over a hiring surge weekend. The shortlist was ready Monday morning. That's not just efficiency — that's a different way of operating entirely.",
    rating: 5,
  },
];

const Testimonials = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-16">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Testimonials
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Recruiters Who've{" "}<span className="text-primary">Never Gone Back</span>
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Hear from the hiring teams who've moved from manual screening to AI-powered decisions — and what changed.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:border-gray-600 transition-all duration-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-primary">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
