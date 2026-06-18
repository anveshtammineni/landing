import { motion } from "framer-motion";
import { Layout, Server, BrainCircuit, Terminal } from "lucide-react";

interface Skill {
  name: string;
  level: number; // percentage
}

interface SkillCategory {
  title: string;
  icon: any;
  color: string;
  glow: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: Layout,
    color: "text-accent-cyan",
    glow: "rgba(0, 242, 254, 0.15)",
    skills: [
      { name: "React.js", level: 92 },
      { name: "Next.js", level: 90 },
      { name: "HTML & CSS", level: 95 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    title: "Backend & Database",
    icon: Server,
    color: "text-accent-purple",
    glow: "rgba(127, 0, 255, 0.15)",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Supabase", level: 85 },
      { name: "REST APIs", level: 90 },
      { name: "SQL", level: 82 },
    ],
  },
  {
    title: "Languages & AI Tools",
    icon: BrainCircuit,
    color: "text-accent-pink",
    glow: "rgba(255, 0, 127, 0.15)",
    skills: [
      { name: "C / C++", level: 85 },
      { name: "JavaScript / TypeScript", level: 90 },
      { name: "Python / Java", level: 80 },
      { name: "OpenAI API", level: 88 },
    ],
  },
  {
    title: "Fundamentals & Tools",
    icon: Terminal,
    color: "text-accent-blue",
    glow: "rgba(79, 172, 254, 0.15)",
    skills: [
      { name: "Data Structures & Algos", level: 85 },
      { name: "OOP & DBMS", level: 88 },
      { name: "Operating Systems", level: 80 },
      { name: "Git & VS Code", level: 90 },
    ],
  },
];

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
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
    <section id="skills" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-purple uppercase mb-2"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Skills & Expertise
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-purple to-accent-pink mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Skill Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skillCategories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={catIndex}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden group"
              >
                {/* Custom glowing backdrop on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${category.glow}, transparent 50%)`,
                  }}
                />

                {/* Floating Skill Spheres/Bubbles (Decorative) */}
                <div className="absolute top-4 right-4 flex gap-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + catIndex,
                      ease: "easeInOut",
                    }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-transparent to-white/10 border border-white/10`}
                  />
                  <motion.div
                    animate={{
                      y: [0, -14, 0],
                      scale: [1, 0.9, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4 + catIndex,
                      ease: "easeInOut",
                    }}
                    className={`w-6 h-6 rounded-full bg-gradient-to-r from-transparent to-white/5 border border-white/10`}
                  />
                </div>

                {/* Category Title */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl bg-white/5 ${category.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Progress List */}
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-300 group-hover:text-white transition-colors duration-200">
                          {skill.name}
                        </span>
                        <span className={`font-mono text-xs ${category.color}`}>
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Dynamic Progress Bar */}
                      <div className="h-2 w-full bg-space-light/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${
                            catIndex === 0
                              ? "from-accent-cyan to-accent-blue"
                              : catIndex === 1
                              ? "from-accent-purple to-accent-cyan"
                              : catIndex === 2
                              ? "from-accent-pink to-accent-purple"
                              : "from-accent-blue to-accent-purple"
                          }`}
                        />
                      </div>
                    </div>
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
