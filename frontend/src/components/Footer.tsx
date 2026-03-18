import { useState } from "react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "Status"],
  Legal: ["Privacy", "Terms", "Security"],
};

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-white">H</span>
              </div>
              <span className="font-heading font-bold text-xl text-gray-900 dark:text-gray-100">
                Hyrex <span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs leading-relaxed">
              AI-powered hiring intelligence — screen faster, match smarter, and build teams that last.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Get hiring tips in your inbox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="btn-gradient px-4 h-10 rounded-lg text-sm font-medium text-white">
                Subscribe
              </button>
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-heading font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            © 2026 Hyrex AI. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a key={s} href="#" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
