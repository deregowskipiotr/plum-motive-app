import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { quotes, SOCIAL_LINKS } from "../../constants";



const Contact = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isIndicatorHovered, setIsIndicatorHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted data:", formData);
    setSubmitSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  // Animation variants (Matching OurStory & Hero)
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }
    }
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const rightSideVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const rightItemVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };
  
  const iconItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const scrollLineVariants: Variants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 }
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center bg-(--color-plum) relative overflow-hidden pt-20 md:pt-0"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-l from-transparent via-(--color-plum)/10 to-black/10 pointer-events-none" />
      
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-(--color-milk)/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full md:pt-20">
        
        {/* Title & Subtitle - Centered */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2
            variants={titleVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            <span className="bg-linear-to-r from-[#C97E5A]/10 via-[#C97E5A]/50 to-[#C97E5A] bg-clip-text text-transparent">
              Contact
            </span>
          </motion.h2>
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-(--color-milk)/60 text-base md:text-2xl max-w-2xl mx-auto"
          >
            Let's create something extraordinary together
          </motion.p>
        </motion.div>

        {/* Content Grid: Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full"
          >
            <motion.p 
              variants={fieldVariants}
              className="text-(--color-milk)/90 text-base md:text-lg leading-relaxed mb-8"
            >
              Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear from you.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-5 border border-(--color-milk)/15 rounded-md p-6 md:p-8 bg-[rgba(255,243,230,0.02)] backdrop-blur-md shadow-xl">
              <motion.div variants={fieldVariants}>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[rgba(255,243,230,0.03)] backdrop-blur-md border border-(--color-milk)/12 rounded-md p-4 text-(--color-milk) placeholder-(--color-milk)/40 focus:outline-none focus:border-[#C97E5A]/60 focus:ring-1 focus:ring-[#C97E5A]/30 transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[rgba(255,243,230,0.03)] backdrop-blur-md border border-(--color-milk)/12 rounded-md p-4 text-(--color-milk) placeholder-(--color-milk)/40 focus:outline-none focus:border-[#C97E5A]/60 focus:ring-1 focus:ring-[#C97E5A]/30 transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[rgba(255,243,230,0.03)] backdrop-blur-md border border-(--color-milk)/12 rounded-md p-4 text-(--color-milk) placeholder-(--color-milk)/40 focus:outline-none focus:border-[#C97E5A]/60 focus:ring-1 focus:ring-[#C97E5A]/30 transition-all duration-300 resize-none"
                />
              </motion.div>

              <motion.div variants={fieldVariants} className="pt-2">
                <PrimaryButton 
                  className="w-full md:w-auto hover:scale-100! group"
                >
                  <span className="flex items-center justify-center gap-2 w-full">
                    Send Message
                    <Send className="w-4 h-4 text-(--color-milk)/70 group-hover:text-[#C97E5A] transition-colors" />
                  </span>
                </PrimaryButton>
              </motion.div>

              {submitSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[#C97E5A] text-sm mt-4 font-light tracking-wide"
                >
                  Message sent successfully! We'll be in touch soon.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Right Side: Quote, Socials, Go Home Indicator */}
          <motion.div
            variants={rightSideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col h-full justify-between mt-12 lg:mt-0"
          >
            
            {/* Quote block */}
            <motion.div variants={rightItemVariants} className="relative min-h-[120px]">
              <span className="absolute -top-6 -left-4 text-6xl text-[#C97E5A]/20 leading-none italic select-none pointer-events-none">"</span>
              <motion.p 
                key={currentQuote}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="text-(--color-milk)/90 text-lg md:text-xl leading-relaxed italic pr-6 relative z-10"
              >
                {quotes[currentQuote]}
              </motion.p>
              <div className="w-16 h-px bg-linear-to-r from-[#C97E5A]/50 to-transparent mt-6" />
            </motion.div>

            {/* Social Icons section */}
            <motion.div variants={rightItemVariants} className="mt-4 lg:mt-32">
              <p className="text-(--color-milk)/60 uppercase tracking-normal text-xs mb-4 font-light">
                Connect with me
              </p>
              
              <motion.div 
                className="flex items-center gap-6"
                variants={containerVariants}
              >
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <motion.a
                    key={label}
                    variants={iconItemVariants}
                    href={href}
                    aria-label={label}
                    className="group flex items-center justify-center relative w-10 h-10 rounded-full transition-colors focus:outline-none"
                  >
                    <Icon className="w-6 h-6 text-(--color-milk)/50 group-hover:text-[#C97E5A] transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[#C97E5A]/20 transition-all duration-300 pointer-events-none" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Go Home Indicator */}
            <motion.div
              variants={scrollLineVariants}
              className="mt-4 lg:mt-auto flex justify-start lg:justify-end"
            >
              <div 
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
                onMouseEnter={() => setIsIndicatorHovered(true)}
                onMouseLeave={() => setIsIndicatorHovered(false)}
                onClick={() => {
                  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="w-px h-10 overflow-hidden">
                  <motion.div
                    className="w-full origin-top transition-colors duration-500"
                    style={{
                      height: "100%",
                      background: isIndicatorHovered
                        ? "linear-gradient(180deg, rgba(201,126,90,0.9) 0%, transparent 100%)"
                        : "linear-gradient(180deg, rgba(201,126,90,0.5) 0%, transparent 100%)",
                    }}
                    animate={{ scaleY: [1, 0.6, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <motion.div
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{
                    background: isIndicatorHovered
                      ? "linear-gradient(180deg, rgba(201,126,90,0.9) 0%, transparent 100%)"
                      : "linear-gradient(180deg, rgba(201,126,90,0.6) 0%, transparent 100%)",
                  }}
                  animate={{
                    y: [0, 12, 0],
                    opacity: [0.6, 0.2, 0.6],
                    scaleY: [1, 1.4, 1],
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.span
                  className="text-xs uppercase tracking-[1px] mt-1 transition-colors duration-500"
                  style={{ 
                    color: isIndicatorHovered ? "rgba(201,126,90,0.9)" : "rgba(201,126,90,0.5)", 
                    fontSize: "0.6rem" 
                  }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Go Home
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Subtle decorative line at bottom */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 h-px bg-linear-to-r from-transparent via-[#C97E5A] to-transparent mx-auto mt-20"
        />
      </div>
    </section>
  );
};

export default Contact;