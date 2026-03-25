import {
  motion,
  useSpring,
  useMotionValue,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number; // px relative to section
  y: number;
}

interface Droplet {
  id: number;
  x: number;   // % of section width
  size: number; // px
  duration: number;
  delay: number;
}

// ─────────────────────────────────────────────
// Hook: detect pointer capability
// ─────────────────────────────────────────────
function useFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false);
  useEffect(() => {
    setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);
  return hasFinePointer;
}

// ─────────────────────────────────────────────
// Hook: respect reduced-motion preference
// ─────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─────────────────────────────────────────────
// Canvas Ripple Layer
// ─────────────────────────────────────────────
const RippleCanvas = memo(({ ripples }: { ripples: Ripple[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  // Internal ripple state with radius tracking
  const activeRef = useRef<
    Array<{ id: number; x: number; y: number; radius: number; opacity: number; born: number }>
  >([]);

  useEffect(() => {
    // On each new ripple from props, push to internal list
    ripples.forEach((r) => {
      const existing = activeRef.current.find((a) => a.id === r.id);
      if (!existing) {
        activeRef.current.push({ ...r, radius: 20, opacity: 0.55, born: performance.now() });
      }
    });
  }, [ripples]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      activeRef.current = activeRef.current.filter((r) => r.opacity > 0.01);

      activeRef.current.forEach((r) => {
        // Draw 3 concentric rings per ripple at staggered radii
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = r.radius - ring * 18;
          if (ringRadius <= 0) continue;

          const gradient = ctx.createRadialGradient(r.x, r.y, ringRadius * 0.5, r.x, r.y, ringRadius);
          gradient.addColorStop(0, `rgba(201,126,90,0)`);
          gradient.addColorStop(0.6, `rgba(201,126,90,${r.opacity * (0.6 - ring * 0.15)})`);
          gradient.addColorStop(0.85, `rgba(201,126,90,${r.opacity * (0.3 - ring * 0.08)})`);
          gradient.addColorStop(1, `rgba(201,126,90,0)`);

          ctx.beginPath();
          ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5 - ring * 0.4;
          ctx.stroke();
        }

        // Advance animation
        r.radius += 2.4;
        r.opacity -= 0.012;
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20 hero-ripple-canvas"
    />
  );
});

RippleCanvas.displayName = "RippleCanvas";

// ─────────────────────────────────────────────
// Animated Letter – magnetic spring cursor pull
// ─────────────────────────────────────────────
interface LetterProps {
  char: string;
  index: number;
  hasFinePointer: boolean;
  reducedMotion: boolean;
  cursorX: number; // absolute px within section
  cursorY: number;
  letterRef: React.RefObject<HTMLSpanElement | null>;
  gradientX: number; // 0-100 cursor pct used for gradient
  gradientY: number;
  isHovering: boolean;
}

const AnimatedLetter = memo(
  ({
    char,
    index,
    hasFinePointer,
    reducedMotion,
    cursorX,
    cursorY,
    letterRef,
    gradientX,
    gradientY,
    isHovering,
  }: LetterProps) => {
    const springX = useMotionValue(0);
    const springY = useMotionValue(0);

    const smoothX = useSpring(springX, { damping: 25, stiffness: 170, mass: 0.7 });
    const smoothY = useSpring(springY, { damping: 25, stiffness: 170, mass: 0.7 });

    // Compute per-letter distortion based on cursor distance
    useEffect(() => {
      if (!hasFinePointer || reducedMotion || !letterRef.current) return;
      const rect = letterRef.current.getBoundingClientRect();
      const lx = rect.left + rect.width / 2;
      const ly = rect.top + rect.height / 2;

      // cursorX / cursorY are section-relative; convert letter center to same coords
      const parentRect = letterRef.current.closest("section")?.getBoundingClientRect();
      if (!parentRect) return;
      const letterSectionX = lx - parentRect.left;
      const letterSectionY = ly - parentRect.top;

      const dx = cursorX - letterSectionX;
      const dy = cursorY - letterSectionY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Intensity falloff
      let intensity = 0;
      if (dist < 150) intensity = 0.8;
      else if (dist < 300) intensity = 0.4 * (1 - (dist - 150) / 150);
      else intensity = 0.1 * (1 - Math.min((dist - 300) / 300, 1));

      const maxShift = 18;

      if (isHovering && dist > 0) {
        const nx = (dx / dist) * maxShift * intensity;
        const ny = (dy / dist) * maxShift * intensity;
        springX.set(nx);
        springY.set(ny);
      } else {
        springX.set(0);
        springY.set(0);
      }
    }, [cursorX, cursorY, isHovering, hasFinePointer, reducedMotion, letterRef, springX, springY]);

    // Build dynamic liquid metal gradient image string only (NOT shorthand background)
    // Keeping backgroundImage separate avoids React's shorthand/non-shorthand conflict warning
    const gradImageStyle = useMemo((): React.CSSProperties => {
      if (!hasFinePointer || reducedMotion) {
        return {
          backgroundImage: "linear-gradient(135deg, #FFF3E6 0%, #C97E5A 50%, #FFF3E6 100%)",
        };
      }
      const gx = gradientX;
      const angle = Math.round(90 + (gx - 50) * 1.2);
      const midStop = Math.round(20 + (gx / 100) * 60);
      return {
        backgroundImage: `linear-gradient(${angle}deg, rgba(255,243,230,1) 0%, rgba(255,243,230,0.85) ${Math.max(midStop - 15, 0)}%, rgba(201,126,90,1) ${midStop}%, rgba(255,243,230,0.9) ${Math.min(midStop + 20, 100)}%, rgba(255,243,230,1) 100%)`,
      };
    }, [gradientX, isHovering, hasFinePointer, reducedMotion]);

    // Drop-shadow lives on the outer motion.span so it doesn't interfere with clip
    const dropShadowFilter = useMemo(() => {
      if (!hasFinePointer || reducedMotion || !isHovering) return undefined;
      const gx = gradientX;
      const gy = gradientY;
      return `drop-shadow(${(gx - 50) * 0.08}px ${(gy - 50) * 0.06}px 6px rgba(201,126,90,0.4))`;
    }, [gradientX, gradientY, isHovering, hasFinePointer, reducedMotion]);

    const letterVariants: Variants = {
      hidden: {
        opacity: 0,
        y: reducedMotion ? 0 : 60,
        rotateX: reducedMotion ? 0 : -90,
        filter: reducedMotion ? "blur(0px)" : "blur(14px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          duration: reducedMotion ? 0.3 : 0.85,
          ease: [0.34, 1.15, 0.64, 1] as [number, number, number, number],
          delay: reducedMotion ? 0 : 2.2 + index * 0.045, // Wait for Navbar (2.2s)
        },
      },
    };

    if (char === " ") {
      return <span className="hero-space-char" />;
    }

    return (
      // Outer motion.span: handles only transform (x/y spring) + filter.
      // Gradient clip lives on the INNER span to avoid shorthand conflicts.
      <motion.span
        ref={letterRef}
        variants={letterVariants}
        style={{
          x: smoothX,
          y: smoothY,
          display: "inline-block",
          willChange: "transform",
          filter: dropShadowFilter,
        }}
        className="relative"
      >
        {/* Inner span owns background-clip: text — static CSS classes keep React happy */}
        <span
          className="liquid-letter"
          style={gradImageStyle}
        >
          {char}
        </span>
      </motion.span>
    );
  }
);

AnimatedLetter.displayName = "AnimatedLetter";

// ─────────────────────────────────────────────
// Main Hero Component
// ─────────────────────────────────────────────
const Hero = () => {
  const hasFinePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);

  const [isIndicatorHovered, setIsIndicatorHovered] = useState(false);

  // Raw cursor motion values (section-relative px)
  const rawCursorX = useMotionValue(0);
  const rawCursorY = useMotionValue(0);

  // Cursor pct (0–100) for gradient angle
  const [cursorPct, setCursorPct] = useState({ x: 50, y: 50 });
  const [cursorPx, setCursorPx] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Ripple queue
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleThrottleRef = useRef(0);

  // Droplet ambient particle system
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  const headline = "This could be your feature App";
  const tagline = "A premium experience where typography breathes, moves, and responds to your presence. Crafted with intention.";

  // Per-letter refs for accurate bounding box distortion
  const letterRefs = useRef<Array<React.RefObject<HTMLSpanElement | null>>>(
    Array.from({ length: headline.length }, () => ({ current: null }))
  );

  // ── Mouse handler ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      rawCursorX.set(px);
      rawCursorY.set(py);
      setCursorPx({ x: px, y: py });
      setCursorPct({ x: (px / rect.width) * 100, y: (py / rect.height) * 100 });

      // Throttle ripple spawning to ~100ms
      const now = performance.now();
      if (now - rippleThrottleRef.current > 100) {
        rippleThrottleRef.current = now;
        setRipples((prev) => [
          ...prev.slice(-12),
          { id: now, x: px, y: py },
        ]);
      }
    },
    [rawCursorX, rawCursorY]
  );

  // ── Droplet particle spawner ──
  useEffect(() => {
    if (reducedMotion) return;
    const spawnDroplet = () => {
      const id = Date.now() + Math.random();
      const droplet: Droplet = {
        id,
        x: 5 + Math.random() * 90,
        size: 2 + Math.random() * 5,
        duration: 1.8 + Math.random() * 1.5,
        delay: Math.random() * 0.2,
      };
      setDroplets((prev) => [...prev.slice(-20), droplet]);
      setTimeout(() => setDroplets((prev) => prev.filter((d) => d.id !== id)), (droplet.duration + droplet.delay) * 1000 + 200);
    };

    const id = setInterval(() => {
      if (Math.random() > 0.25) spawnDroplet();
    }, 450);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Entrance container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0, delayChildren: 1.2 },
    },
  };

  const taglineVariants: Variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: {
      opacity: 0.75,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.3, ease: "easeOut", delay: 3.4 }, // Wait for Hero letters
    },
  };

  const scrollLineVariants: Variants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 4.0 },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-80 overflow-hidden select-none z-0"
      onMouseMove={hasFinePointer ? handleMouseMove : undefined}
      onMouseEnter={() => hasFinePointer && setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        rawCursorX.set(0);
        rawCursorY.set(0);
      }}
    >
      {/* ── Ambient background glow that follows cursor ── */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: hasFinePointer && isHovering
              ? `radial-gradient(ellipse 60% 55% at ${cursorPct.x}% ${cursorPct.y}%, rgba(90,30,65,0.45) 0%, rgba(56,25,50,0) 80%)`
              : "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(80,25,60,0.35) 0%, rgba(56,25,50,0) 80%)",
            transition: "background 0.25s ease-out",
          }}
        />
      )}

      {/* ── Subtle ambient drift overlay ── */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 opacity-15"
          animate={{
            background: [
              "radial-gradient(circle at 18% 45%, rgba(201,126,90,0.06) 0%, transparent 55%)",
              "radial-gradient(circle at 82% 60%, rgba(201,126,90,0.06) 0%, transparent 55%)",
              "radial-gradient(circle at 45% 25%, rgba(201,126,90,0.06) 0%, transparent 55%)",
              "radial-gradient(circle at 18% 45%, rgba(201,126,90,0.06) 0%, transparent 55%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* ── Canvas ripple layer ── */}
      {hasFinePointer && !reducedMotion && <RippleCanvas ripples={ripples} />}

      {/* ── Main text block ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline with per-letter spring physics */}
        <h1
          className="text-5xl sm:text-7xl md:text-7xl lg:text-9xl font-semibold text-center leading-none tracking-tight hero-headline"
          style={{ cursor: hasFinePointer ? "grab" : "default" }}
        >
          {headline.split("").map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              hasFinePointer={hasFinePointer}
              reducedMotion={reducedMotion}
              cursorX={cursorPx.x}
              cursorY={cursorPx.y}
              letterRef={letterRefs.current[i]}
              gradientX={cursorPct.x}
              gradientY={cursorPct.y}
              isHovering={isHovering}
            />
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 text-center text-base md:text-xl max-w-xl mx-auto leading-relaxed font-light hero-tagline"
        >
          {tagline}
        </motion.p>
      </motion.div>

      {/* ── Ambient falling droplets ── */}
      {!reducedMotion &&
        droplets.map((droplet) => (
          <motion.div
            key={droplet.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${droplet.x}%`,
              top: 0,
              width: droplet.size,
              height: droplet.size * 2.5,
              background:
                "linear-gradient(180deg, rgba(255,243,230,0.9) 0%, rgba(201,126,90,0.6) 60%, transparent 100%)",
              boxShadow: "0 0 4px rgba(201,126,90,0.4)",
              willChange: "transform, opacity",
            }}
            initial={{ y: -30, opacity: 0, scaleX: 0.6 }}
            animate={{
              y: "100vh",
              opacity: [0, 0.9, 0.7, 0],
              scaleX: [0.6, 1, 0.8, 0.6],
            }}
            transition={{
              duration: droplet.duration,
              delay: droplet.delay,
              ease: [0.32, 0.72, 0, 1],
            }}
          />
        ))}

      {/* ── Scroll indicator with drip animation ── */}
      <motion.div
        variants={scrollLineVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 cursor-pointer"
        onClick={() => {
          document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" });
        }}
        onMouseEnter={() => setIsIndicatorHovered(true)}
        onMouseLeave={() => setIsIndicatorHovered(false)}
      >
        {/* Vertical line */}
        <motion.div
          className="w-px origin-top transition-colors duration-500"
          style={{
            height: 40,
            background: isIndicatorHovered
              ? "linear-gradient(180deg, rgba(201,126,90,0.9) 0%, transparent 100%)"
              : "linear-gradient(180deg, rgba(201,126,90,0.5) 0%, transparent 100%)",
          }}
          animate={reducedMotion ? {} : { scaleY: [1, 0.6, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Falling drop */}
        {!reducedMotion && (
          <motion.div
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{
              background: isIndicatorHovered
                ? "linear-gradient(180deg, rgba(201,126,90,0.9) 0%, transparent 100%)"
                : "linear-gradient(180deg, rgba(201,126,90,0.55) 0%, transparent 100%)",
            }}
            animate={{
              y: [0, 12, 0],
              opacity: [0.55, 0.2, 0.55],
              scaleY: [1, 1.4, 1],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Scroll text */}
        <motion.span
          className="text-xs uppercase tracking-[0.25em] mt-1   transition-colors duration-500"
          style={{
            color: isIndicatorHovered
              ? "rgba(201,126,90,0.9)"
              : "rgba(201,126,90,0.35)",
            fontSize: "0.6rem",
          }}
          animate={reducedMotion ? {} : { opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          scroll
        </motion.span>
      </motion.div>
    </section>
  );
};

export default Hero;