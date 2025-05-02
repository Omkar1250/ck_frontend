// Pagination Component
import React from "react";

const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
          currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Previous
      </button>
      <span className="text-gray-800 font-semibold text-lg text-center">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
          currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;