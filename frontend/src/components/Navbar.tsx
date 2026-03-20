import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Platform", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Results", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const { user, isAuthenticated, signOut } = useAuth();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading font-bold text-sm text-white">H</span>
          </div>
          <span className="font-heading font-bold text-xl text-gray-900 dark:text-gray-100">
            Hyrex <span className="text-primary">AI</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700 cursor-pointer">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-blue-50 dark:bg-blue-950 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User size={14} /> Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => { signOut(); window.location.href = "/"; }}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut size={14} className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <a
                href="/signin"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors px-4 py-2"
              >
                Sign In
              </a>
              <Link
                to="/dashboard"
                className="btn-gradient px-5 py-2 rounded-lg text-sm font-medium text-white"
              >
                Try Hyrex AI
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 pb-6 pt-4 space-y-1">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <a
                  href="/profile"
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </a>
                <button
                  onClick={() => { signOut(); window.location.href = "/"; }}
                  className="block w-full text-left text-sm text-destructive py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/signin"
                  className="block text-center py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </a>
                <Link
                  to="/dashboard"
                  className="btn-gradient block text-center py-2.5 rounded-lg text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Try Hyrex AI
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
