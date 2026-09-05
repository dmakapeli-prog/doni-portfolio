"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ==================================================================
   CINEMATIC INITIAL LOADER
   - Full-screen overlay (bg-[#030712]) on first page load
   - Animated logo monogram "< DM />" with elegant pulse
   - Circular loading indicator with orbit animation
   - Fades out + slides up after ~2s to reveal portfolio
   - CRITICAL: No overflow manipulation on body — uses only
     pointer-events and visibility to avoid scroll-blocking bugs
   ================================================================== */
export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExited, setIsExited] = useState(false);

  useEffect(() => {
    // Hold loader for 2 seconds, then begin exit animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // When isLoading flips to false, the exit animation runs (~0.8s).
  // onExitComplete marks the overlay as fully gone so we can unmount it.
  // NO body.style.overflow manipulation anywhere — eliminates scroll bugs.

  if (isExited) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsExited(true)}>
      {isLoading && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -60,
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="loader-overlay"
        >
          {/* ---- Background ambient glow ---- */}
          <div className="loader-ambient-glow loader-ambient-glow--top" />
          <div className="loader-ambient-glow loader-ambient-glow--bottom" />

          {/* ---- Central Content ---- */}
          <div className="loader-center">

            {/* Circular Orbit Ring */}
            <div className="loader-orbit-ring">
              <div className="loader-orbit-dot" />
            </div>

            {/* Logo Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15,
              }}
              className="loader-logo"
            >
              <span className="loader-logo-bracket">&lt;</span>
              <span className="loader-logo-initials">DM</span>
              <span className="loader-logo-bracket"> /&gt;</span>
            </motion.div>

            {/* Subtitle Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="loader-subtitle"
            >
              Donie Makapeli.
            </motion.p>

            {/* Horizontal Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="loader-bar-track"
            >
              <div className="loader-bar-fill" />
            </motion.div>
          </div>

          {/* ---- Scanline overlay effect ---- */}
          <div className="loader-scanlines" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
