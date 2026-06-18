import { motion } from "framer-motion";
import { Layout, Box, Cpu, HardDrive } from "lucide-react";

interface TechGroup {
  category: string;
  icon: any;
  items: string[];
  color: string;
  glow: string;
  colSpan: string;
  details: string;
}

const techGroups: TechGroup[] = [
  {
    category: "Frontend Stack",
    icon: Layout,
    items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML & CSS"],
    color: "text-accent-cyan",
    glow: "rgba(0, 242, 254, 0.1)",
    colSpan: "md:col-span-8",
    details: "Developing modern, reactive, and optimized user interfaces and frontend layouts.",
  },
  {
    category: "Languages Core",
    icon: Box,
    items: ["C", "C++", "Python", "Java", "SQL"],
    color: "text-accent-purple",
    glow: "rgba(127, 0, 255, 0.1)",
    colSpan: "md:col-span-4",
    details: "Solid foundations in object-oriented programming, data models, and languages.",
  },
  {
    category: "AI & Tools",
    icon: Cpu,
    items: ["OpenAI API", "Git", "GitHub", "VS Code"],
    color: "text-accent-pink",
    glow: "rgba(255, 0, 127, 0.1)",
    colSpan: "md:col-span-4",
    details: "Leveraging generative models and professional development tools for speed.",
  },
  {
    category: "Backend & Databases",
    icon: HardDrive,
    items: ["Node.js", "Express.js", "Supabase", "MongoDB", "REST APIs"],
    color: "text-accent-blue",
    glow: "rgba(79, 172, 254, 0.1)",
    colSpan: "md:col-span-8",
    details: "Building secure, scalable API endpoints, authentication flows, and relational/NoSQL structures.",
  },
];

export default function TechStack() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="tech-stack" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-blue uppercase mb-2"
          >
            System Core
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Tech Stack Architecture
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-blue to-accent-cyan mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {techGroups.map((group, index) => {
            const Icon = group.icon;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className={`p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden group flex flex-col justify-between min-h-[260px] ${group.colSpan}`}
              >
                {/* Spotlight background */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${group.glow}, transparent 50%)`,
                  }}
                />

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 ${group.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white">
                      {group.category}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 max-w-xl mb-8 leading-relaxed">
                    {group.details}
                  </p>
                </div>

                {/* Tech Badges Grid */}
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item, itemIdx) => (
                    <motion.span
                      key={itemIdx}
                      whileHover={{ scale: 1.05 }}
                      className="text-xs font-semibold font-mono px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all cursor-default"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
