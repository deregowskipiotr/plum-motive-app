import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "../../constants";



const Products = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Animation variants matching OurStory
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

  const carouselContainerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.4, ease: "easeOut" }
    }
  };

  const cardVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.78, 0.35, 1.02],
        type: "spring",
        damping: 20,
        stiffness: 180
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -15 : 15,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    })
  };

  const paginationVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.6 }
    }
  };

  const nextProduct = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToProduct = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center bg-(--color-plum) relative overflow-hidden pt-20"
    >
      {/* Background gradient overlay matching hero style */}
      <div className="absolute inset-0 bg-linear-to-l from-transparent via-(--color-plum)/10 to-black/10 pointer-events-none" />
      
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-(--color-milk)/5 via-transparent to-transparent opacity-30 pointer-events-none" />
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#C97E5A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C97E5A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Title & Subtitle - Matching OurStory styling */}
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
              Our Products
            </span>
          </motion.h2>
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-(--color-milk)/60 text-base md:text-2xl max-w-4xl mx-auto"
          >
            Crafted with precision, designed for excellence
          </motion.p>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          variants={carouselContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Navigation Arrows - Static but animated entrance */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              onClick={prevProduct}
              className="w-12 h-12 rounded-full bg-(--color-milk)/5 backdrop-blur-md border border-(--color-milk)/12 flex items-center justify-center transition-all duration-300 hover:bg-[#C97E5A]/30 hover:border-(--color-milk)/24 group cursor-pointer"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-6 h-6 text-(--color-milk)/70 group-hover:text-(--color-milk) transition-colors cursor-pointer" />
            </motion.button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              onClick={nextProduct}
              className="w-12 h-12 rounded-full bg-(--color-milk)/5 backdrop-blur-md border border-(--color-milk)/12 flex items-center justify-center transition-all duration-300 hover:bg-[#C97E5A]/30 hover:border-(--color-milk)/24 group"
              aria-label="Next product"
            >
              <ChevronRight className="w-6 h-6 text-(--color-milk)/70 group-hover:text-(--color-milk) transition-colors cursor-pointer" />
            </motion.button>
          </div>

          {/* Cards Container */}
          <div className="relative overflow-hidden px-4 py-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="max-w-2xl mx-auto"
              >
                <div className="group relative overflow-hidden rounded-2xl p-8 md:p-10 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-(--color-milk)/12 hover:border-(--color-milk)/24"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,243,230,0.08) 0%, rgba(255,243,230,0.03) 100%)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,243,230,0.1)"
                  }}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${products[currentIndex].gradient.split(' ')[0].replace('from-', 'rgba')}, transparent 70%)`
                    }}
                  />

                  {/* Tag Badge */}
                  {products[currentIndex].tag && (
                    <div className="absolute top-6 right-6 hidden md:block">
                      <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full bg-[#C97E5A]/20 text-[#C97E5A] border border-[#C97E5A]/30 backdrop-blur-sm">
                        {products[currentIndex].tag}
                      </span>
                    </div>
                  )}

                  {/* Icon Container */}
                  {/* Icon Container */}
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, rgba(201,126,90,0.15), rgba(201,126,90,0.03))`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(201,126,90,0.15)"
                    }}
                  >
                    {(() => {
                      const IconComponent = products[currentIndex].Icon;
                      return (
                        <IconComponent 
                          className="w-10 h-10 transition-all duration-500" 
                          style={{ 
                              color: "rgba(201,126,90,0.9)",
                            filter: "drop-shadow(0 2px 8px rgba(201,126,90,0.4))"
                          }} 
                        />
                      );
                    })()}
                    {/* Glossy highlight */}
                    <div className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                        borderRadius: "inherit"
                      }}
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="text-3xl md:text-4xl font-semibold text-center mb-3 bg-linear-to-br from-(--color-milk) to-(--color-milk)/70 bg-clip-text text-transparent">
                    {products[currentIndex].title}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-[#C97E5A]">
                      {products[currentIndex].price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-(--color-milk)/70 text-center leading-relaxed mb-6">
                    {products[currentIndex].description}
                  </p>

                  {/* CTA Button */}
                  <motion.button
                    className="w-full py-3 rounded-lg bg-linear-to-r from-[#C97E5A]/20 to-[#C97E5A]/10 border border-[#C97E5A]/30 text-[#C97E5A] font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#C97E5A]/10 cursor-pointer"
                  >
                    Learn More →
                  </motion.button>

                  {/* Decorative bottom line */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-px bg-linear-to-r from-transparent via-[#C97E5A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <motion.div
            variants={paginationVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex justify-center gap-3 mt-8"
          >
            {products.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goToProduct(index)}
                className="group relative cursor-pointer"
                aria-label={`Go to product ${index + 1}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#C97E5A] w-8"
                      : "bg-(--color-milk)/30 group-hover:bg-(--color-milk)/50"
                  }`}
                />
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute inset-0 rounded-full bg-[#C97E5A] opacity-50 blur-sm"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

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

export default Products;