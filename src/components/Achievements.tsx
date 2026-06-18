import { motion } from "framer-motion";
import { Trophy, Award, GitBranch } from "lucide-react";

interface Achievement {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  icon: any;
  color: string;
  glow: string;
}

const achievements: Achievement[] = [
  {
    title: "AI/ML Competency Certificate",
    subtitle: "iHub-Data, IIIT Hyderabad",
    description: "Completed an intensive 24-week professional training program focused on AI/ML foundations, architectures, and implementations.",
    date: "Feb 2026",
    icon: Trophy,
    color: "text-accent-cyan bg-accent-cyan/10",
    glow: "rgba(0, 242, 254, 0.15)",
  },
  {
    title: "Big Data Computing Elite status",
    subtitle: "IIT Patna (NPTEL)",
    description: "Completed NPTEL certification in Big Data computing from the Indian Institute of Technology Patna, achieving an Elite score of 77%.",
    date: "Dec 2025",
    icon: Award,
    color: "text-accent-purple bg-accent-purple/10",
    glow: "rgba(127, 0, 255, 0.15)",
  },
  {
    title: "Data Science Certification",
    subtitle: "Infosys Springboard",
    description: "Completed Python-based data analysis and machine learning concepts course covering fundamental ML structures.",
    date: "Jan 2026",
    icon: GitBranch,
    color: "text-accent-pink bg-accent-pink/10",
    glow: "rgba(255, 0, 127, 0.15)",
  },
  {
    title: "OpenAI GPT Models Certification",
    subtitle: "Infosys Springboard",
    description: "Completed course training on OpenAI GPT models, gaining knowledge of Generative AI, GPT architectures, and AI-powered applications.",
    date: "Jan 2026",
    icon: GitBranch,
    color: "text-accent-cyan bg-accent-cyan/10",
    glow: "rgba(0, 242, 254, 0.15)",
  },
];

export default function Achievements() {
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
    <section id="achievements" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-pink uppercase mb-2"
          >
            Milestones
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Key Achievements
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-pink to-accent-purple mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
        >
          {achievements.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden group w-full flex flex-col justify-between"
              >
                {/* Radial glow background on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 10%, ${item.glow}, transparent 60%)`,
                  }}
                />

                <div>
                  <div className="flex justify-between items-center mb-8">
                    {/* Icon Container */}
                    <div className={`p-4 rounded-2xl ${item.color} flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                    {/* Date */}
                    <span className="font-mono text-xs font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-accent-cyan transition-colors">
                    {item.title}
                  </h3>
                  <h4 className="text-sm font-semibold text-slate-400 mb-4">
                    {item.subtitle}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {item.description}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-accent-cyan transition-colors">
                    Verified Record
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
