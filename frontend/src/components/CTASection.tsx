import useInView from "@/hooks/useInView";

const CTASection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="cta" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <article
          ref={ref}
          className={`relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-primary transition-all duration-700 ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 text-center py-20 px-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
              <div className="h-2 w-2 rounded-full bg-blue-200 animate-pulse" />
              <span className="text-sm text-blue-100 font-medium">No credit card required · Setup in 2 minutes</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4 text-white">
              Your Next Great Hire Is{" "}
              <span className="text-blue-200">One Click Away</span>
            </h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10">
              Join 500+ forward-thinking recruitment teams who've replaced manual screening with intelligent automation. Start free — no setup fee, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/dashboard" className="bg-white text-primary px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors">
                Start Hiring Smarter
              </a>
              <button className="border border-white/40 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors">
                See a Live Demo
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CTASection;
