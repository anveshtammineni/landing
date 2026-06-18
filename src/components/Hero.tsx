import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Magnetic from "./ui/Magnetic";

const roles = ["Full-Stack Developer", "AI & ML Builder", "Computer Science Student"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Typewriter effect
  useEffect(() => {
    let timer: number;
    const currentFullText = roles[roleIndex];

    if (isDeleting) {
      // Deleting speed
      setTypingSpeed(50);
      timer = window.setTimeout(() => {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
      }, typingSpeed);
    } else {
      // Typing speed
      setTypingSpeed(100);
      timer = window.setTimeout(() => {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
      }, typingSpeed);
    }

    // Handle string transitions
    if (!isDeleting && displayedText === currentFullText) {
      // Pause at full text
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, typingSpeed]);

  const handleScrollDown = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center select-none overflow-hidden z-10"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle Pill Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,254,0.1)]"
        >
          Available for new opportunities
        </motion.div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display text-white leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="inline-block"
          >
            Hi, I'm{" "}
          </motion.span>{" "}
          <motion.span
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.25,
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="inline-flex bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink bg-clip-text text-transparent bg-size-200 animate-aurora"
          >
            {Array.from("Anvesh Tammineni").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      damping: 14,
                      stiffness: 150
                    }
                  }
                }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Dynamic Typewriter Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 h-8 text-xl md:text-3xl font-medium text-slate-300 font-sans flex items-center"
        >
          <span>I'm a&nbsp;</span>
          <span className="text-accent-cyan font-bold typewriter-caret">
            {displayedText}
          </span>
        </motion.div>

        {/* Description paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed"
        >
          Dedicated Computer Science Engineering student at CBIT. Proven expertise in
          building efficient Full-Stack Web Applications and integrating intelligent AI/ML workflows.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Magnetic>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-purple hover:to-accent-pink transition-all duration-300 shadow-[0_0_20px_rgba(127,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] text-center w-48 sm:w-auto"
            >
              Explore Projects
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-full font-bold text-slate-200 border border-white/10 bg-white/5 backdrop-blur-md hover:border-accent-cyan/50 hover:bg-white/10 hover:text-white transition-all duration-300 text-center w-48 sm:w-auto"
            >
              Contact Me
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 1.2 }}
        onClick={handleScrollDown}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-accent-cyan transition-colors"
      >
        <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-slate-500 flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-accent-cyan"
          />
        </div>
      </motion.button>
    </section>
  );
}
