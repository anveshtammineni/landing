import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Layout, Globe, ExternalLink } from "lucide-react";
import Magnetic from "./ui/Magnetic";

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  category: string;
  color: string;
  icon: any;
}

const projects: Project[] = [
  {
    title: "AI Interview Simulator",
    description: "An AI-powered interview platform featuring automated workflows, user authentication, and a modular UI architecture. Integrates scalable backend components.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "OpenAI API"],
    github: "https://github.com/anveshtammineni/AI-INTERVIEW-SIMULATOR",
    demo: "https://demo.com",
    category: "Full-Stack & AI",
    color: "from-accent-cyan to-accent-blue",
    icon: Cpu,
  },
  {
    title: "AI Content Analyzer",
    description: "An AI-driven content evaluation and summarization platform with responsive interfaces. Focuses on content workflows and structured analysis.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    github: "https://github.com/anveshtammineni/AI-CONTENT-SUMMARISER",
    demo: "https://demo.com",
    category: "Full-Stack & AI",
    color: "from-accent-purple to-accent-pink",
    icon: Globe,
  },
  {
    title: "SudokuSphere",
    description: "A responsive Sudoku platform incorporating puzzle generation algorithms, JWT authentication, request validation, and persistent game state.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/anveshtammineni/Sudoku",
    demo: "https://sudoku-client-seven.vercel.app/",
    category: "Full-Stack Web App",
    color: "from-accent-blue to-accent-purple",
    icon: Layout,
  },
];

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion values for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXSpring = useSpring(useTransform(y, [0, 1], [15, -15]), { damping: 20, stiffness: 200 });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-15, 15]), { damping: 20, stiffness: 200 });

  // Spotlight position relative coordinates
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalizing tilt position
    x.set(mouseX / width);
    y.set(mouseY / height);

    // Dynamic spotlight variables
    spotlightX.set(mouseX);
    spotlightY.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const ProjectIcon = project.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden group w-full cursor-pointer transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-accent-purple/5"
    >
      {/* Background Spotlight glow effect */}
      <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([sx, sy]) => `radial-gradient(400px circle at ${sx}px ${sy}px, rgba(255, 255, 255, 0.05), transparent 80%)`
          ),
        }}
      />

      {/* Floating Category Tag */}
      <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(30px)" }}>
        <span className={`px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${project.color} text-white shadow-md shadow-black/20`}>
          {project.category}
        </span>
        <div className="text-slate-400 group-hover:text-white transition-colors duration-300">
          <ProjectIcon size={22} />
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-2xl font-bold font-display text-white mb-4 group-hover:text-accent-cyan transition-colors"
        style={{ transform: "translateZ(40px)" }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed text-slate-400 mb-6 group-hover:text-slate-300 transition-colors"
        style={{ transform: "translateZ(30px)" }}
      >
        {project.description}
      </p>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-2 mb-8" style={{ transform: "translateZ(20px)" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-semibold font-mono px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3.5 items-center" style={{ transform: "translateZ(45px)" }}>
        <Magnetic>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-5 py-2.5 rounded-full border border-white/5 bg-white/5 transition-all hover:border-white/20"
          >
            <GithubIcon className="w-3.5 h-3.5" /> View Code
          </a>
        </Magnetic>
        {project.demo && project.demo !== "https://demo.com" && (
          <Magnetic>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan hover:text-white px-5 py-2.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 transition-all hover:border-accent-cyan/40 hover:bg-accent-cyan/10"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
            </a>
          </Magnetic>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="projects" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-cyan uppercase mb-2"
          >
            Showcase
          </motion.p>
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-cyan to-accent-purple mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
