import useInView from "@/hooks/useInView";

const integrations = [
  "Greenhouse", "Lever", "Workday", "BambooHR",
  "LinkedIn", "Indeed", "Slack", "Microsoft Teams",
  "SAP SuccessFactors", "iCIMS", "Bullhorn", "Jobvite",
];

const Integrations = () => {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header ref={ref} className="text-center mb-16">
          <span className={`inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Integrations
          </span>
          <h2 className={`text-4xl sm:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-gray-100 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Works With Your <span className="text-primary">Stack</span>
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200 ${isInView ? "opacity-100" : "opacity-0"}`}>
            Seamless integrations with the ATS and HR platforms you already use. Connect Greenhouse, Lever, Workday, LinkedIn, and more.
          </p>
        </header>

        <div className="overflow-hidden carousel-mask">
          <div className="flex animate-carousel gap-6 w-max">
            {[...integrations, ...integrations].map((name, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 min-w-[130px] shadow-sm hover:shadow-md dark:hover:border-gray-600 transition-shadow"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-primary">{name.slice(0, 2)}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
