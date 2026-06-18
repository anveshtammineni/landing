import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Magnetic from "./ui/Magnetic";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "py-4 bg-space-black/40 backdrop-blur-lg border-b border-white/5 shadow-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Magnetic>
            <a
              href="#hero"
              onClick={(e) => scrollToSection(e, "#hero")}
              className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-1 group"
            >
              <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent group-hover:from-accent-purple group-hover:to-accent-pink transition-all duration-300">
                Anvesh
              </span>
              <span className="text-white">.T</span>
            </a>
          </Magnetic>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Magnetic key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 py-1 px-2 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-300 group-hover:w-full" />
                </a>
              </Magnetic>
            ))}
          </div>

          {/* Contact CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="px-5 py-2 text-sm font-semibold rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xs hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,242,254,0.05)] hover:shadow-[0_0_20px_rgba(0,242,254,0.2)]"
              >
                Hire Me
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[73px] left-0 w-full z-40 bg-space-black/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item, index) => (
                <motion.a
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-lg font-semibold text-slate-300 hover:text-white py-1 transition-colors"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.05 }}
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold shadow-lg shadow-accent-purple/25"
              >
                Get in Touch
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
