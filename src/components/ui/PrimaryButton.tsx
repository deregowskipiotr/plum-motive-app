import { motion } from "framer-motion";

interface PrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const PrimaryButton = ({ children, className = '', onClick }: PrimaryButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        group relative overflow-hidden
        px-5 py-1.5 backdrop-blur-md 
        rounded-md border border-(--color-milk)/20
        bg-(--color-milk)/5 text-(--color-milk) 
        shadow-[2px_2px_10px_rgba(0,0,0,0.2)]
        hover:shadow-[0px_5px_20px_var(--color-milk)] hover:shadow-[#C97E5A]
        hover:bg-(--color-milk)/10 hover:border-(--color-milk)/50
        transition-all duration-700 ease-out cursor-pointer
        font-light tracking-widest
        ${className}
      `}
      whileTap={{ filter: "brightness(0.85)" }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div 
        className="absolute inset-0 bg-linear-to-r from-transparent via-(--color-milk)/15 to-transparent pointer-events-none"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.button>
  );
};