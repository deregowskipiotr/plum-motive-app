import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { Lock, Key, Unlock, ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [dialValue, setDialValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isDialFocused, setIsDialFocused] = useState(false);

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

  const vaultVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, rotateY: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.8, delay: 0.3, ease: [0.21, 0.78, 0.35, 1.02] }
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.21, 0.78, 0.35, 1.02],
        type: "spring",
        damping: 20,
        stiffness: 150
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const handleUnlock = () => {
    if (dialValue === 777) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      // Shake effect on lock
      const lockElement = document.getElementById('lock-icon');
      if (lockElement) {
        lockElement.classList.add('shake');
        setTimeout(() => lockElement.classList.remove('shake'), 500);
      }
      setTimeout(() => setError(false), 500);
    }
  };

  const handleBackToLock = () => {
    setIsUnlocked(false);
    setDialValue(0);
    setEmail("");
    setIsSubmitted(false);
    setError(false);
  };

  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    // Store raw value without padding
    setDialValue(rawValue === "" ? 0 : parseInt(rawValue, 10));
    setError(false);
  };

  const getDisplayValue = () => {
    if (isDialFocused) {
      // When focused, show actual typed value (no padding)
      return dialValue === 0 ? "" : dialValue.toString();
    } else {
      // When blurred, show padded value
      return dialValue.toString().padStart(3, '0');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");
    
    // Reset to front side after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setIsUnlocked(false);
      setDialValue(0);
    }, 5000);
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center bg-(--color-plum) relative overflow-hidden pt-20"
    >
      {/* Background gradient overlay matching hero style */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-(--color-plum)/10 to-black/10 pointer-events-none" />
      
      {/* Subtle ambient glow matching other sections */}
      <div className="absolute inset-0 bg-radial-gradient from-(--color-milk)/5 via-transparent to-transparent opacity-30 pointer-events-none" />
      
      {/* Decorative floating elements matching products section */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#C97E5A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C97E5A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
        {/* Title & Subtitle */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2
            variants={titleVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            <span className="bg-linear-to-r from-[#C97E5A]/10 via-[#C97E5A]/50 to-[#C97E5A] bg-clip-text text-transparent">
              The Vault
            </span>
          </motion.h2>
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-(--color-milk)/60 text-base md:text-2xl max-w-2xl mx-auto"
          >
            Exclusive access to the Newsletter. Unlock insider insights, early releases, and curated wisdom.
          </motion.p>
        </motion.div>

        {/* Vault Card */}
        <motion.div
          variants={vaultVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Main Vault Container */}
          <div 
            className="relative overflow-hidden rounded-2xl p-10 md:p-12 backdrop-blur-xl transition-all duration-500 border border-[#C97E5A]/20"
            style={{
              background: "linear-gradient(135deg, rgba(10,8,12,0.85) 0%, rgba(20,15,18,0.9) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,126,90,0.2)"
            }}
          >
            {/* Metallic border effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              background: "linear-gradient(135deg, rgba(201,126,90,0.3) 0%, transparent 30%, transparent 70%, rgba(201,126,90,0.2) 100%)",
            }} />
            
            {/* Engraved pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #C97E5A 0px, #C97E5A 1px, transparent 1px, transparent 4px)",
              }}
            />
            
            {/* Decorative rivets - vault details */}
            <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#C97E5A]/30 border border-[#C97E5A]/50" />
            <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-[#C97E5A]/30 border border-[#C97E5A]/50" />
            <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-[#C97E5A]/30 border border-[#C97E5A]/50" />
            <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-[#C97E5A]/30 border border-[#C97E5A]/50" />

            {/* State Management */}
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                /* Locked State - Front Side with Circle Dial */
                <motion.div
                  key="locked"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Lock Icon with Pulse Animation */}
                  <motion.div 
                    id="lock-icon"
                    className="flex justify-center"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <div className="relative">
                      <Lock className="w-20 h-20 text-[#C97E5A]/60" strokeWidth={1.5} />
                      <div className="absolute inset-0 blur-xl bg-[#C97E5A]/20 rounded-full" />
                    </div>
                  </motion.div>

                  {/* Intriguing Copy */}
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl md:text-3xl font-light text-(--color-milk)/80 tracking-wide">
                      Restricted Access
                    </h3>
                    <p className="text-(--color-milk)/50 text-sm max-w-md mx-auto">
                      This vault contains exclusive content, early releases, and privileged insights.
                    </p>
                  </div>

                  {/* Circle Dial with Keyboard Support */}
                  <div className="max-w-xs mx-auto space-y-5">
                    <div className="text-center">
                      <p className="text-(--color-milk)/40 text-xs uppercase tracking-[2px] mb-3">
                        Unlock Combination
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="relative">
                          {/* Circle Dial Input */}
                          <input
                            type="text"
                            value={getDisplayValue()}
                            onChange={handleDialChange}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsDialFocused(true)}
                            onBlur={() => setIsDialFocused(false)}
                            placeholder="777"
                            className={`w-32 h-32 rounded-full border-2 ${
                              error ? "border-red-500/50" : "border-[#C97E5A]/40"
                            } bg-black/40 flex items-center justify-center backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#C97E5A] focus:ring-2 focus:ring-[#C97E5A]/20 text-center text-3xl font-mono text-[#C97E5A] tracking-wider`}
                            style={{
                              textAlign: "center",
                              MozAppearance: "textfield",
                              appearance: "textfield"
  }}
/>
                          {/* Decorative top indicator */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6">
                            <div className="w-full h-full rounded-full border-t-2 border-[#C97E5A]/60" />
                          </div>
                        </div>
                      </div>
                      <p className="text-(--color-milk)/30 text-xs mt-3">
                        Type or click to enter code
                      </p>
                      {error && (
                        <p className="text-red-400/70 text-xs mt-2">
                          Invalid code. Hint: Try 777
                        </p>
                      )}
                    </div>

                    {/* Unlock Button */}
                    <motion.button
                      onClick={handleUnlock}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-lg border border-[#C97E5A]/40 text-[#C97E5A] font-medium transition-all duration-300 hover:bg-[#C97E5A]/10 hover:border-[#C97E5A] flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Key className="w-4 h-4" />
                      <span>Unlock the Vault</span>
                    </motion.button>
                  </div>

                  {/* Hint */}
                  <p className="text-center text-(--color-milk)/25 text-xs">
                    Hint: ✦ Try 777 ✦ The master key ✦
                  </p>
                </motion.div>
              ) : (
                /* Unlocked State - Newsletter Form with Back Button */
                <motion.div
                  key="unlocked"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  {/* Back Button */}
                  <div className="absolute top-14 md:top-14 left-6 md:left-14">
                    <motion.button
                      onClick={handleBackToLock}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-(--color-milk)/50 hover:text-[#C97E5A] transition-colors text-sm group cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Vault</span>
                    </motion.button>
                  </div>

                  {/* Success Header */}
                  <div className="text-center space-y-3 pt-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="inline-flex mx-auto"
                    >
                      <Unlock className="w-12 h-12 text-[#C97E5A]" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-light text-(--color-milk)/80 tracking-wide">
                      Access Granted
                    </h3>
                    <p className="text-(--color-milk)/60 text-sm max-w-md mx-auto">
                      Welcome to the inner circle. Enter your details to receive exclusive content.
                    </p>
                  </div>

                  {/* Decorative Line */}
                  <div className="w-16 h-px bg-linear-to-r from-transparent via-[#C97E5A] to-transparent mx-auto" />

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
                    <div className="relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        disabled={isLoading}
                        className="w-full px-0 py-3 bg-transparent border-b border-(--color-milk)/20 text-(--color-milk) placeholder:text-(--color-milk)/30 focus:outline-none focus:border-[#C97E5A] transition-all duration-300 text-center md:text-left"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-[#C97E5A] group-focus-within:w-full transition-all duration-500" />
                    </div>

                    {/* Benefits Preview */}
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                      {[
                        { icon: Sparkles, text: "Weekly Insights" },
                        { icon: Zap, text: "Early Access" },
                        { icon: Shield, text: "Exclusive" }
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1 text-(--color-milk)/40 text-xs">
                          <Icon className="w-3 h-3 text-[#C97E5A]/60" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-lg bg-linear-to-r from-[#C97E5A] to-[#C97E5A]/80 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#C97E5A]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Opening...
                          </>
                        ) : isSubmitted ? (
                          <>
                            <span>✓</span>
                            Welcome to the Vault
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Claim Your Access
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-[#C97E5A]/0 via-white/20 to-[#C97E5A]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>

                    {/* Success Message */}
                    <AnimatePresence>
                      {isSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center text-sm text-[#C97E5A] bg-[#C97E5A]/10 border border-[#C97E5A]/20 rounded-lg p-3"
                        >
                          ✦ You're now part of an exclusive circle ✦
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Privacy Note */}
                    <p className="text-center text-(--color-milk)/30 text-xs">
                      Join with intention. Unsubscribe with ease.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 h-px bg-linear-to-r from-transparent via-[#C97E5A] to-transparent mx-auto mt-16"
        />
      </div>

      {/* Add shake animation CSS */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        
        /* Remove number input arrows */
        input[type="text"]::-webkit-outer-spin-button,
        input[type="text"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </section>
  );
};

export default Newsletter;