import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Wheat, Flame, Droplet, Clock } from "lucide-react";

const timelineCards = [
  { year: "2024", label: "Concept & Vision", Icon: Wheat },
  { year: "2025", label: "Design & Innovation", Icon: Flame },
  { year: "2026", label: "Development & Polish", Icon: Droplet },
  { year: "Tomorrow", label: "Your Story Begins", Icon: Clock },
];

const OurStory = () => {
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, amount: 0.3 });

  // Animation variants
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

  const leftTextVariants: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.92,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.21, 0.78, 0.35, 1.02], // Custom easing for liquid feel
        type: "spring",
        damping: 18,
        stiffness: 90,
        mass: 0.8
      }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };  

  return (
    <section
      id="our-story"
      className="min-h-screen flex flex-col items-center justify-center bg-(--color-plum) relative overflow-hidden py-20 md:py-0"
    >
      {/* Background gradient overlay matching hero style */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-(--color-plum)/10 to-black/10 pointer-events-none" />
      
      {/* Subtle ambient glow (optional, matches hero atmosphere) */}
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight "
          >
            <span className="bg-linear-to-r from-[#C97E5A]/10 via-[#C97E5A]/50 to-[#C97E5A] bg-clip-text text-transparent">Our Story</span>
          </motion.h2>
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-(--color-milk)/60 text-base md:text-2xl max-w-4xl mx-auto"
          >
            Crafting digital experiences with intention, precision, and a touch of elegance
          </motion.p>
        </motion.div>

        {/* Content Grid: Left Text + Right Timeline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left side - Descriptive Text */}
          <motion.div
            ref={textRef}
            variants={leftTextVariants}
            initial="hidden"
            animate={isTextInView ? "visible" : "hidden"}
            className="space-y-5"
          >
            <p className="text-(--color-milk)/90 leading-relaxed text-base md:text-lg">
              Every great creation begins with a spark of inspiration. Our journey started with a simple idea: to build digital experiences that feel as elegant as they perform.
            </p>
            <p className="text-(--color-milk)/90 leading-relaxed">
              We believe in the power of thoughtful design and seamless functionality. Each project we craft is an opportunity to push boundaries, explore new possibilities, and deliver something truly memorable.
            </p>
            <p className="text-(--color-milk)/90 leading-relaxed">
              From the first line of code to the final polish, we pour intention into every detail. Our approach blends technical excellence with creative vision, ensuring that what we build not only works beautifully but feels alive.
            </p>
            <p className="text-(--color-milk)/90 leading-relaxed">
              This template represents our commitment to quality. It's designed to be a foundation—a canvas ready for your unique vision, your brand, your story to unfold.
            </p>
            <p className="text-(--color-milk)/90 leading-relaxed">
              Whether you're launching a new venture, reimagining an existing brand, or building something entirely new, we've crafted this with you in mind. The journey is just beginning.
            </p>
            <div className="pt-4">
              <div className="w-12 h-px bg-linear-to-r from-[#C97E5A] to-transparent" />
            </div>
          </motion.div>

          {/* Right side - Timeline Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            {timelineCards.map(({ year, label, Icon }) => (
              <motion.div
                key={year}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-md p-5 md:p-6 text-center backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl border border-(--color-milk)/12 hover:border-(--color-milk)/24"
                style={{
                   background: "linear-gradient(135deg, rgba(255,243,230,0.06) 0%, rgba(255,243,230,0.02) 100%)",
                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,243,230,0.1)"
                }}
              >
                {/* Inner glow effect - subtle and luxurious */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 30% 20%, rgba(201,126,90,0.08) 0%, transparent 70%)"
                  }}
                />
                
                {/* Icon container with glossy effect */}
                <div className="relative w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,126,90,0.1) 0%, rgba(201,126,90,0.02) 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(201,126,90,0.15)"
                  }}
                >
                  <Icon 
                    className="w-7 h-7 transition-all duration-500" 
                    style={{ 
                      color: "rgba(201,126,90,0.85)",
                      filter: "drop-shadow(0 2px 8px rgba(201,126,90,0.4))"
                    }} 
                  />
                  {/* Glossy highlight */}
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                      borderRadius: "inherit"
                    }}
                  />
                </div>

                {/* Year with subtle gradient text */}
                <span className="block text-3xl md:text-4xl font-semibold tracking-tight bg-linear-to-br from-(--color-milk) to-(--color-milk)/70 bg-clip-text text-transparent">
                  {year}
                </span>
                
                {/* Label with refined typography */}
                <p className="text-(--color-milk)/55 text-[12px] mt-2 leading-relaxed tracking-wide font-light uppercase">
                  {label}
                </p>

                {/* Decorative bottom line - appears on hover */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-linear-to-r from-transparent via-[#C97E5A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Subtle decorative line at bottom (optional) */}
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

export default OurStory;