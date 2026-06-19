import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Mail, Loader2, Phone } from "lucide-react";
import confetti from "canvas-confetti";
import Magnetic from "./ui/Magnetic";

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";
      
      if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
        throw new Error("API Key is missing or using placeholder. Please set a valid VITE_WEB3FORMS_ACCESS_KEY in your .env file.");
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Transmission from ${formData.name}`,
          from_name: "Anvesh Portfolio",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        // Trigger canvas-confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#7f00ff", "#ff007f", "#4facfe"],
        });

        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ name: "", email: "", message: "" });
        }, 5000);
      } else {
        setSubmitError(data.message || "Failed to send message. Please try again later.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { icon: GithubIcon, href: "https://github.com/anveshtammineni", label: "GitHub", color: "hover:text-accent-cyan" },
    { icon: LinkedinIcon, href: "www.linkedin.com/in/anvesh-tammineni-ba6aa53b0", label: "LinkedIn", color: "hover:text-accent-purple" },
    { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter", color: "hover:text-accent-pink" },
    { icon: Mail, href: "mailto:anveshtammineni@gmail.com", label: "Email", color: "hover:text-accent-blue" },
  ];

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-accent-cyan uppercase mb-2"
          >
            Transmission
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white"
          >
            Get In Touch
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-accent-cyan to-accent-purple mx-auto mt-4 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Socials */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden group">
              {/* Floating Backglow */}
              <motion.div
                animate={{
                  x: [0, 15, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-10 -right-10 w-36 h-36 bg-accent-cyan/10 rounded-full filter blur-2xl pointer-events-none"
              />
              <h3 className="relative z-10 text-2xl font-bold font-display text-white mb-6">
                Let's collaborate on something great.
              </h3>
              <p className="relative z-10 text-slate-400 leading-relaxed text-sm mb-8">
                Whether you have a specific project idea, are looking to hire a full-stack engineer, or want to discuss artificial intelligence and procedural rendering, drop a message!
              </p>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/5 text-accent-cyan">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-semibold">anveshtammineni@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/5 text-accent-cyan">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm font-semibold">+91 7989189663</span>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden">
              {/* Floating Backglow */}
              <motion.div
                animate={{
                  x: [0, -12, 0],
                  y: [0, 15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-purple/10 rounded-full filter blur-2xl pointer-events-none"
              />
              <h4 className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                Connect channels
              </h4>
              <div className="relative z-10 flex gap-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Magnetic key={index}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-slate-400 flex items-center justify-center transition-all ${social.color} hover:border-white/20 hover:bg-white/10`}
                      >
                        <Icon size={20} />
                      </a>
                    </Magnetic>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 p-8 rounded-3xl border border-white/5 bg-space-card backdrop-blur-md relative overflow-hidden"
          >
            {/* Ambient glows inside card */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-full filter blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -25, 0],
                y: [0, 25, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="absolute -bottom-16 -left-16 w-52 h-52 bg-gradient-to-br from-accent-pink/5 to-accent-purple/5 rounded-full filter blur-3xl pointer-events-none"
            />

            <motion.form 
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onSubmit={handleSubmit} 
              className="space-y-6 relative z-10"
            >
              {/* Name field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                  Name
                </label>
                <div className="relative">
                  {/* Glowing Focus Backdrop */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: focusedField === "name" ? 1 : 0,
                      scale: focusedField === "name" ? 1.015 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink filter blur-[2px] pointer-events-none z-0"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="relative z-10 w-full bg-[#0a0720]/90 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#070517] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && <span className="text-xs text-red-400 font-semibold">{errors.name}</span>}
              </motion.div>

              {/* Email field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                  Email Address
                </label>
                <div className="relative">
                  {/* Glowing Focus Backdrop */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: focusedField === "email" ? 1 : 0,
                      scale: focusedField === "email" ? 1.015 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink filter blur-[2px] pointer-events-none z-0"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="relative z-10 w-full bg-[#0a0720]/90 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#070517] transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-400 font-semibold">{errors.email}</span>}
              </motion.div>

              {/* Message field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                  Message
                </label>
                <div className="relative">
                  {/* Glowing Focus Backdrop */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: focusedField === "message" ? 1 : 0,
                      scale: focusedField === "message" ? 1.012 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink filter blur-[2px] pointer-events-none z-0"
                  />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    className="relative z-10 w-full bg-[#0a0720]/90 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#070517] transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                {errors.message && <span className="text-xs text-red-400 font-semibold">{errors.message}</span>}
              </motion.div>

              {submitError && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center leading-relaxed"
                >
                  {submitError}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Magnetic className="w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full py-4.5 rounded-2xl font-bold text-white bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink hover:bg-size-200 transition-all duration-300 shadow-[0_0_20px_rgba(127,0,255,0.2)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] flex items-center justify-center gap-3 disabled:opacity-85 group"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="submitting"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="animate-spin" size={18} /> Processing Transmission...
                        </motion.span>
                      ) : isSuccess ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-white"
                        >
                          <CheckCircle2 size={18} /> Sent Successfully!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          Send Transmission 
                          <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1 group-hover:scale-110" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </Magnetic>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
