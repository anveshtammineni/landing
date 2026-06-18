import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface Job {
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  color: string;
}

const experiences: Job[] = [
  {
    role: "Bachelor of Engineering in Computer Science Engineering",
    company: "Chaitanya Bharathi Institute of Technology (CBIT)",
    duration: "Mar 2026 - Present",
    location: "Hyderabad, India",
    description: [
      "Pursuing BE in CSE, building a solid computer science and engineering base.",
      "Maintained a strong academic record with an 8.60 CGPA."
    ],
    color: "from-accent-cyan to-accent-blue"
  },
  {
    role: "Artificial Intelligence & Machine Learning Course",
    company: "iHub-Data, IIIT Hyderabad",
    duration: "Sept 2025 - Feb 2026",
    location: "Hyderabad, India",
    description: [
      "Completed an intensive 24-week professional training program focused on AI/ML foundations and applications.",
      "Earned a Certificate of Competency in AI/ML."
    ],
    color: "from-accent-purple to-accent-pink"
  },
  {
    role: "Big Data Computing Elite Certification",
    company: "IIT Patna (NPTEL)",
    duration: "Oct - Dec 2025",
    location: "Online",
    description: [
      "Completed Big Data Computing online course certification under IIT Patna.",
      "Achieved Elite Certificate status with a consolidated score of 77%."
    ],
    color: "from-accent-blue to-accent-purple"
  },
  {
    role: "Data Science & Generative AI Courses",
    company: "Infosys Springboard",
    duration: "Jan 2026",
    location: "Online",
    description: [
      "Completed Python-based data analysis and machine learning concepts course.",
      "Completed 'Introduction to OpenAI GPT Models' course, learning generative structures and AI-powered applications."
    ],
    color: "from-accent-pink to-accent-purple"
  },
  {
    role: "Secondary Intermediate Education",
    company: "Sri Chaitanya Junior College",
    duration: "Jun 2022 - Mar 2024",
    location: "Hyderabad, India",
    description: [
      "Completed intermediate high-school education with focus on math, physics, and chemistry."
    ],
    color: "from-accent-cyan to-accent-purple"
  }
];

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = (index: number) => ({
    hidden: { 
      opacity: 0, 
      x: index % 2 === 0 ? -50 : 50 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  });

  return (
    <section id="experience" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-cyan uppercase mb-2"
          >
            Qualifications
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Education & Certifications
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-cyan to-accent-purple mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Centered timeline vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-cyan via-accent-purple to-transparent -translate-x-[1px]" />

          {/* Timeline Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {experiences.map((job, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col md:flex-row items-stretch md:justify-between">
                  {/* Spacer or Left Card */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? "justify-end" : "order-last md:order-first justify-start"}`}>
                    {!isEven && (
                      <div className="hidden md:block w-full" /> // Spacer for right aligned cards
                    )}
                    
                    {isEven && (
                      <motion.div
                        variants={cardVariants(index)}
                        className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md glow-card relative overflow-hidden w-full text-right"
                      >
                        {/* Dot pointer glow */}
                        <div className="absolute top-6 -right-[3px] w-2 h-4 bg-accent-cyan hidden md:block" />
                        
                        <div className="flex flex-row-reverse items-center gap-3 text-xs font-bold text-accent-cyan mb-2">
                          <Calendar size={14} />
                          <span>{job.duration}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{job.role}</h3>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">{job.company}</h4>
                        
                        <div className="flex flex-row-reverse items-center gap-1.5 text-xs text-slate-500 mb-6">
                          <MapPin size={12} />
                          <span>{job.location}</span>
                        </div>

                        <ul className="space-y-3 text-sm text-slate-400 leading-relaxed list-none pl-0">
                          {job.description.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex flex-row-reverse gap-2 items-start justify-start">
                              <span className="text-accent-cyan mt-1.5 ml-2 w-1.5 h-1.5 rounded-full shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  {/* Icon Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 top-8 w-8 h-8 rounded-full bg-space-black border border-white/10 flex items-center justify-center -translate-x-1/2 z-20 group">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                      className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${job.color}`}
                    />
                  </div>

                  {/* Right Card or Spacer */}
                  <div className={`w-full md:w-[45%] flex ${!isEven ? "justify-start" : "justify-end"}`}>
                    {isEven && (
                      <div className="hidden md:block w-full" /> // Spacer for left aligned cards
                    )}
                    
                    {!isEven && (
                      <motion.div
                        variants={cardVariants(index)}
                        className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md glow-card relative overflow-hidden w-full"
                      >
                        {/* Dot pointer glow */}
                        <div className="absolute top-6 -left-[3px] w-2 h-4 bg-accent-purple hidden md:block" />
                        
                        <div className="flex items-center gap-3 text-xs font-bold text-accent-purple mb-2">
                          <Calendar size={14} />
                          <span>{job.duration}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{job.role}</h3>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">{job.company}</h4>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                          <MapPin size={12} />
                          <span>{job.location}</span>
                        </div>

                        <ul className="space-y-3 text-sm text-slate-400 leading-relaxed list-none">
                          {job.description.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex gap-2 items-start justify-start">
                              <span className="text-accent-purple mt-1.5 mr-2 w-1.5 h-1.5 rounded-full shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
