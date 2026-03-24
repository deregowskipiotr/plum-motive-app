import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { ScrollProgress } from "../ui/ScrollProgress";
import { NAV_LINKS } from "../../constants";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home"); // default active is home

  // Handle scroll detection for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    // We use a small timeout to allow dynamic content (if any) to render before attaching observers
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" } // Triggers when a section is within the top part of the viewport
    );

    setTimeout(() => {
      NAV_LINKS.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Framer Motion variants
  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.8 } },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 1.2 + i * 0.1,
      },
    }),
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 1.6 } 
    },
  };

  const mobileMenuVariants: Variants = {
    hidden: { x: "100%", borderTopLeftRadius: "50%", borderBottomLeftRadius: "50%" },
    visible: { 
      x: 0, 
      borderTopLeftRadius: "0%", 
      borderBottomLeftRadius: "0%", 
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { 
      x: "100%", 
      borderTopLeftRadius: "50%", 
      borderBottomLeftRadius: "50%", 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  const mobileItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <>
      <ScrollProgress />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-(--color-plum)/80 backdrop-blur-md py-4 shadow-lg"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        {/* Animated width border bottom for the Navbar itself (h-px) */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-[0.5px] transition-colors duration-500 ease-in-out ${
            scrolled ? "bg-(--color-milk)/10" : "bg-transparent"
          }`} 
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative">
          
          {/* Logo */}
          <motion.a
            href="/"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl font-light italic tracking-tighter text-(--color-milk)"
          >
            PD
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((item, i) => {
              const isActive = activeSection === item.id;
              
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative uppercase transition-colors duration-300 text-sm tracking-wide py-1 ${
                    isActive ? "text-(--color-milk)" : "text-(--color-milk)/70 hover:text-(--color-milk)"
                  }`}
                  onClick={() => setActiveSection(item.id)} // Optimistic update
                >
                  {item.label}
                  {/* Active Border Bottom Indicator */}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px bg-linear-to-r from-(--color-milk)/20 to-(--color-milk)"
                    initial={false}
                    animate={{ width: isActive ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Desktop Button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block"
          >
            <PrimaryButton>Log In</PrimaryButton>
          </motion.div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-(--color-milk) p-2 focus:outline-none"
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-(--color-plum)/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-(--color-milk) p-2 focus:outline-none hover:rotate-90 transition-transform duration-300"
              aria-label="Close Menu"
            >
              <X size={32} />
            </button>

            {/* Mobile Links */}
            <motion.div className="flex flex-col items-center space-y-8 w-full px-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    variants={mobileItemVariants}
                    onClick={() => {
                      setActiveSection(link.id);
                      setIsOpen(false);
                    }}
                    className={`relative text-xl tracking-normal uppercase font-light py-2 transition-colors duration-300 ${
                      isActive ? "text-(--color-milk)" : "text-(--color-milk)/70"
                    }`}
                  >
                    {link.label}
                    {/* Active Border Bottom Indicator for Mobile */}
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-(--color-milk)"
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </motion.a>
                );
              })}

              <motion.div
                variants={mobileItemVariants}
                className="w-full pt-8 flex justify-center"
              >
                <PrimaryButton className="w-full max-w-xs py-2 text-lg" onClick={() => setIsOpen(false)}>
                  Log In
                </PrimaryButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
