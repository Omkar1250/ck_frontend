import React from "react";
import { X, Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search...", onClear }) => {
  return (
    <div className="flex justify-center my-4 relative w-full max-w-md mx-auto">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 pointer-events-none">
        <Search size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg 
            flex items-center justify-center text-richblack-400 
            hover:text-pink-200 hover:bg-pink-200/10 transition-all duration-150"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
