import React from "react";

const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium w-32 transition-all duration-200 ${
          currentPage === 1
            ? "bg-richblack-700/50 text-richblack-400 cursor-not-allowed"
            : "btn-ghost hover:bg-white/[0.06]"
        }`}
      >
        ← Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-richblack-300 text-sm">Page</span>
        <span
          className="inline-flex items-center justify-center min-w-[2.5rem] h-9 px-3 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6473AA, #8B5CF6)' }}
        >
          {currentPage}
        </span>
        <span className="text-richblack-300 text-sm">of {totalPages}</span>
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium w-32 transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-richblack-700/50 text-richblack-400 cursor-not-allowed"
            : "btn-ghost hover:bg-white/[0.06]"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;