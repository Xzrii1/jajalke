"use client";

import { MotionConfig, motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}