"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ==================================================================
   CINEMATIC INITIAL LOADER
   - Fixed-position overlay, z-9999, completely removed from DOM on exit
   - ZERO body/html overflow manipulation
   - AnimatePresence unmounts component after exit animation completes
   ================================================================== */
export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = useCallback(() => {
    // Fully remove from DOM — no invisible layer remains
    setShouldRender(false);
  }, []);

  // Component returns absolutely nothing after exit — no DOM node at all
  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -50,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#030712",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Ambient glows */}
          <div className="loader-ambient-glow loader-ambient-glow--top" />
          <div className="loader-ambient-glow loader-ambient-glow--bottom" />

          {/* Center content */}
          <div className="loader-center">
            <div className="loader-orbit-ring">
              <div className="loader-orbit-dot" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="loader-logo"
            >
              <span className="loader-logo-bracket">&lt;</span>
              <span className="loader-logo-initials">DM</span>
              <span className="loader-logo-bracket"> /&gt;</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="loader-subtitle"
            >
              Donie Makapeli.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="loader-bar-track"
            >
              <div className="loader-bar-fill" />
            </motion.div>
          </div>

          <div className="loader-scanlines" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
