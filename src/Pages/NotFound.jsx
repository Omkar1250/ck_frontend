import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0e17 0%, #161d29 50%, #0a0e17 100%)' }}>
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6473AA 0%, transparent 60%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="text-center relative z-10"
      >
        {/* Large 404 */}
        <h1 className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter text-gradient select-none">
          404
        </h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-richblack-200 text-lg sm:text-xl mt-2 mb-8"
        >
          Oops! This page doesn't exist.
        </motion.p>

        {/* Go Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link
            to="/"
            className="btn-gradient inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom accent */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full opacity-30"
        style={{ background: 'linear-gradient(90deg, #6473AA, #8B5CF6)' }} />
    </div>
  );
};

export default NotFound;