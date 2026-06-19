import { motion } from "framer-motion";
import { User, Cpu, Code2, Globe } from "lucide-react";

const stats = [
  { value: "8.60", label: "CGPA (CBIT)", icon: Code2, color: "text-accent-cyan" },
  { value: "3", label: "Full-Stack Apps", icon: Globe, color: "text-accent-purple" },
  { value: "3", label: "Tech Credentials", icon: Cpu, color: "text-accent-pink" },
  { value: "20+", label: "Skills Mastered", icon: User, color: "text-accent-blue" },
];

export default function About() {
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
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="about" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-cyan uppercase mb-2"
          >
            System Overview
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            About Me
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-cyan to-accent-purple mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Hologram Console Panel (Main Bio) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-8 rounded-3xl border border-white/10 bg-space-card backdrop-blur-md glow-card relative overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full filter blur-2xl pointer-events-none" />

            <h3 className="text-2xl font-bold font-display text-white mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
              Biography
            </h3>

            <div className="space-y-6 text-slate-300 font-sans leading-relaxed text-base">
              <p>
                Hello! I am <span className="text-white font-semibold">Anvesh Tammineni</span>, a Computer Science Engineering 
                student at CBIT (Chaitanya Bharathi Institute of Technology). I have a strong academic record (8.60 CGPA) 
                and a deep focus on Full-Stack Web Development and Artificial Intelligence / Machine Learning.
              </p>
              <p>
                My engineering philosophy centers around creating responsive, optimized web platforms that solve real-world problems. 
                I build applications using modern tech stacks like Next.js, React, Node.js, and Supabase, and integrate robust AI models and data pipelines.
              </p>
              <p>
                With a solid foundation in core computer science principles—including data structures, algorithms, object-oriented design, 
                and database systems—I treat every project as a piece of digital craftsmanship, combining code reliability with fluid interaction.
              </p>
            </div>
          </motion.div>

          {/* Interactive Info / Stats Panel */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-6 rounded-2xl border border-white/5 bg-space-card backdrop-blur-md flex flex-col justify-between hover:border-white/10 relative overflow-hidden group"
                >
                  {/* Subtle Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-lg bg-white/5 ${stat.color} transition-colors duration-300`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <span className="text-3xl md:text-4xl font-extrabold font-display text-white block tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2 block">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
