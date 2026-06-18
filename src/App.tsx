import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import CustomCursor from "./components/CustomCursor";
import NeuralNetworkBackground from "./components/NeuralNetworkBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import Magnetic from "./components/ui/Magnetic";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Physics-based smooth scroll using Lenis
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [loading]);

  // Simulated Boot Loader progress
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 15) + 5;
          const next = prev + increment;
          return next > 100 ? 100 : next;
        });
      }, 80);
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[99999] bg-[#030014] flex flex-col justify-center items-center select-none"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,35,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,35,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Center glow */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-accent-purple/10 filter blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center">
              {/* Spinning glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-20 h-20 rounded-full border-2 border-slate-800 border-t-accent-cyan border-r-accent-purple relative"
              />
              
              {/* Boot text */}
              <h2 className="mt-8 font-display font-semibold text-lg uppercase tracking-widest text-slate-400">
                System Initializing
              </h2>
              
              {/* Progress percentage */}
              <span className="mt-2 font-mono text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                {progress}%
              </span>

              {/* Status bar */}
              <div className="mt-6 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen bg-space-black selection:bg-accent-cyan/20 selection:text-accent-cyan">
          {/* Custom Cursor Trail */}
          <CustomCursor />

          {/* Interactive AI-inspired Neural Network Canvas Background */}
          <NeuralNetworkBackground />

          {/* Floating Navigation Header */}
          <Navbar />

          {/* Main Content Sections */}
          <main className="relative z-10">
            <Hero />
            
            {/* Section Divider Grid lines */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <About />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <Skills />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <Projects />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <Experience />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <Achievements />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <TechStack />
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <Contact />
          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/5 bg-space-black/80 backdrop-blur-md py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <p className="text-sm text-slate-500">
                  &copy; {new Date().getFullYear()} Anvesh Tammineni. All rights reserved.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Engineered with React, TypeScript, Tailwind CSS, & React Three Fiber.
                </p>
              </div>

              {/* Scroll back to top button */}
              <Magnetic>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-bold text-slate-400 hover:text-white hover:border-white/10 transition-colors"
                >
                  Back To Orbit &uarr;
                </button>
              </Magnetic>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
